using System.Text;
using System.Text.Json;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace System203
{
    public class CtrlKProgram
    {
        [DllImport("user32.dll")]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, int fsModifiers, int vk);

        private const int CTRL = 0x0002;
        private const int K_KEY = 0x4B;
        private const int SHIFT = 0x0004;
        private const int X_KEY = 0x58;
        private const int KEYEVENTF_KEYUP = 0x0002;

        private const string API_KEY = "AIzaSyBtv2YXmEIdA27SCRf6Zu4gHo-KWxBHhYU";
        private const string API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
        private static readonly HttpClient client = new HttpClient();
        
        [DllImport("user32.dll")]
        private static extern void keybd_event(byte bVk, byte bScan, int dwFlags, int dwExtraInfo);

        public static void Start()
        {
            if (Environment.OSVersion.Version.Major >= 6)
            {
                SetProcessDPIAware();
            }

            Thread mainThread = new Thread(() =>
            {
                RunAsync().GetAwaiter().GetResult();
            });
            mainThread.SetApartmentState(ApartmentState.STA);
            mainThread.Start();
        }

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        static async Task RunAsync()
        {
            string hướngDẫn = "HƯỚNG DẪN SỬ DỤNG:\n\n" +
                             "Ctrl + K: Gửi nội dung clipboard tới Gemini AI và nhận phản hồi\n" +
                             "Ctrl + Shift + X: Thoát chương trình\n\n" +
                             "Nhấn OK để chạy chương trình ẩn.";

            MessageBox.Show(hướngDẫn, "System203", MessageBoxButtons.OK, MessageBoxIcon.Information);

            try
            {
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 1, CTRL, K_KEY);
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 2, CTRL | SHIFT, X_KEY);

                while (true)
                {
                    await Task.Delay(100);

                    if (GetAsyncKeyState(Keys.Control) != 0)
                    {
                        if ((GetAsyncKeyState(Keys.K) & 0x8000) != 0 && (GetAsyncKeyState(Keys.Control) & 0x8000) != 0)
                        {
                            await HandleGeminiQuery();
                            await Task.Delay(500);
                        }
                    }

                    if ((GetAsyncKeyState(Keys.Control) & 0x8000) != 0 
                        && (GetAsyncKeyState(Keys.ShiftKey) & 0x8000) != 0 
                        && (GetAsyncKeyState(Keys.X) & 0x8000) != 0)
                    {
                        Environment.Exit(0);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Lỗi: {ex.Message}");
            }
        }

        public static async Task HandleGeminiQuery()
        {
            try
            {
                // Thêm Ctrl+C trước
                keybd_event((byte)0x11, 0, 0, 0); // CTRL
                keybd_event(0x43, 0, 0, 0);       // C
                await Task.Delay(100);
                keybd_event(0x43, 0, KEYEVENTF_KEYUP, 0);
                keybd_event((byte)0x11, 0, KEYEVENTF_KEYUP, 0);
                
                // Đợi clipboard cập nhật
                await Task.Delay(200);

                string clipboardText = "";
                Thread staThread = new Thread(() =>
                {
                    try 
                    {
                        if (Clipboard.ContainsText(TextDataFormat.UnicodeText))
                        {
                            // Lấy text Unicode từ clipboard
                            clipboardText = Clipboard.GetText(TextDataFormat.UnicodeText);
                            
                            // Đảm bảo encoding đúng cho tiếng Việt
                            byte[] bytes = Encoding.Unicode.GetBytes(clipboardText);
                            clipboardText = Encoding.Unicode.GetString(bytes);
                            
                            Debug.WriteLine($"Text từ clipboard: {clipboardText}");
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Lỗi khi lấy text từ clipboard: {ex.Message}");
                    }
                });
                staThread.SetApartmentState(ApartmentState.STA);
                staThread.Start();
                staThread.Join();

                if (!string.IsNullOrEmpty(clipboardText))
                {
                    // Phần còn lại của code giữ nguyên, chỉ thêm debug
                    Debug.WriteLine($"Text gửi tới AI: {clipboardText}");
                    
                    var requestBody = new
                    {
                        contents = new[] {
                            new {
                                role = "user",
                                parts = new[] { new { text = "//mã c# kết nối CSDL" } }
                            },
                            new {
                                role = "model",
                                parts = new[] { new { text = "```json\n{\n\"code\":\"//mã c# kết nối CSDL\\nusing System.Data.SqlClient;\\n\\nstring connectionString = \\\"Data Source=YourServerName;Initial Catalog=YourDatabaseName;User ID=YourUserName;Password=YourPassword;\\\";\\n\\nusing (SqlConnection connection = new SqlConnection(connectionString))\\n{\\n    try\\n    {\\n        connection.Open();\\n        Console.WriteLine(\\\"Kết nối thành công!\\\");\\n\\n        // Thực hiện các truy vấn dữ liệu ở đây\\n        string query = \\\"SELECT * FROM YourTableName\\\";\\n        using (SqlCommand command = new SqlCommand(query, connection))\\n        {\\n            using (SqlDataReader reader = command.ExecuteReader())\\n            {\\n                while (reader.Read())\\n                {\\n                    // Xử lý dữ liệu từ reader\\n                    Console.WriteLine($\\\"ID: {reader[0]}, Name: {reader[1]}\\\");\\n                }\\n            }\\n        }\\n    }\\n    catch (Exception ex)\\n    {\\n        Console.WriteLine($\\\"Lỗi kết nối: {ex.Message}\\\");\\n    }\\n    finally\\n    {\\n        if (connection.State == System.Data.ConnectionState.Open)\\n        {\\n            connection.Close();\\n        }\\n    }\\n}\"\n}\n```" }
                                }
                            },
                            new {
                                role = "user",
                                parts = new[] { new { text = "//Mã tính 1+1=" } }
                            },
                            new {
                                role = "model",
                                parts = new[] { new { text = "```json\n{\n\"code\":\"//Mã tính 1+1=\\nint a = 1;\\nint b = 1;\\nint sum = a + b;\\nConsole.WriteLine(sum);\"\n}\n```" }
                                }
                            },
                            new {
                                role = "user",
                                parts = new[] { new { text = clipboardText } }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 1,
                            topK = 40,
                            topP = 0.95,
                            maxOutputTokens = 8192,
                            responseMimeType = "application/json"
                        }
                    };

                    var json = JsonSerializer.Serialize(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");
                    
                    var response = await client.PostAsync($"{API_URL}?key={API_KEY}", content);
                    var responseJson = await response.Content.ReadAsStringAsync();
                    
                    // In ra response gốc từ API
                    Debug.WriteLine("Raw API Response:");
                    Debug.WriteLine(responseJson);
                    
                    // Cập nhật phần xử lý JSON response
                    using JsonDocument document = JsonDocument.Parse(responseJson);
                    string text = "";
                    
                    try {
                        var jsonResponse = document.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();

                        Debug.WriteLine("Parsed JSON Response:");
                        Debug.WriteLine(jsonResponse);

                        // Thử parse JSON response để lấy code
                        using JsonDocument codeDoc = JsonDocument.Parse(jsonResponse);
                        text = codeDoc.RootElement.GetProperty("code").GetString();
                        
                        Debug.WriteLine("Final Code Output:");
                        Debug.WriteLine(text);
                    }
                    catch (Exception ex) {
                        Debug.WriteLine($"Error parsing JSON: {ex.Message}");
                        // Nếu không parse được JSON, sử dụng text gốc
                        text = document.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();
                            
                        Debug.WriteLine("Fallback Text Output:");
                        Debug.WriteLine(text);
                    }

                    if (!string.IsNullOrEmpty(text))
                    {
                        Thread pasteThread = new Thread(() =>
                        {
                            Clipboard.SetText(text);
                            SendKeys.SendWait("^v"); // Ctrl+V để paste
                        });
                        pasteThread.SetApartmentState(ApartmentState.STA);
                        pasteThread.Start();
                        pasteThread.Join();
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Lỗi khi xử lý Gemini query: {ex.Message}");
            }
        }

        [DllImport("user32.dll")]
        private static extern short GetAsyncKeyState(Keys vKey);
    }
} 