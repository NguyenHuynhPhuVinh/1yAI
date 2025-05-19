using FireSharp.Config;
using FireSharp.Interfaces;
using System.Runtime.InteropServices;
using System.Diagnostics;
using Newtonsoft.Json;

namespace System203
{
    public class NoUIProgram
    {
        [DllImport("user32.dll")]
        private static extern bool RegisterHotKey(IntPtr hWnd, int id, int fsModifiers, int vk);

        [DllImport("user32.dll")]
        private static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, int dwExtraInfo);

        private const int KEYEVENTF_KEYUP = 0x0002;
        private const byte VK_LWIN = 0x5B; // Mã phím Windows
        private const int CTRL = 0x0002;
        private const int H_KEY = 0x48;
        private const int J_KEY = 0x4A;
        private const int K_KEY = 0x4B;
        private const int SHIFT = 0x0004;
        private const int X_KEY = 0x58;
        
        private static IFirebaseClient? client;
        
        private static string lastTestValue = "";
        
        // Thêm biến để lưu trạng thái của Ctrl + H
        private static bool enableFirebaseMonitoring = false;
        
        public static void Start()
        {
            // Đổi nội dung MessageBox
            DialogResult result = MessageBox.Show(
                "Bạn có muốn bật tính năng nhận tín hiệu không?",
                "Cấu hình",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question
            );
            enableFirebaseMonitoring = (result == DialogResult.Yes);

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
            try 
            {
                // Cấu hình Firebase
                IFirebaseConfig config = new FirebaseConfig
                {
                     AuthSecret = "y5KYvYGhHei338L0jIWmgHhR5B4oIEs9kybuky01",
                    BasePath = "https://test-e61cd-default-rtdb.asia-southeast1.firebasedatabase.app/"
                };

                client = new FireSharp.FirebaseClient(config);

                // Đăng ký các phím tắt
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 1, CTRL, H_KEY);
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 2, CTRL, J_KEY);
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 3, CTRL, K_KEY);
                RegisterHotKey(Process.GetCurrentProcess().MainWindowHandle, 4, CTRL | SHIFT, X_KEY);

                // Bắt đầu task theo dõi Firebase
                _ = MonitorFirebaseAsync();

                // Vòng lặp chính
                while (true)
                {
                    await Task.Delay(100);
                    
                    if (GetAsyncKeyState(Keys.Control) != 0)
                    {
                        if ((GetAsyncKeyState(Keys.H) & 0x8000) != 0 && (GetAsyncKeyState(Keys.Control) & 0x8000) != 0)
                        {
                            await SaveToFirebase();
                        }
                        else if ((GetAsyncKeyState(Keys.J) & 0x8000) != 0 && (GetAsyncKeyState(Keys.Control) & 0x8000) != 0)
                        {
                            await CtrlKProgram.HandleGeminiQuery();
                            await Task.Delay(500);
                        }
                        else if ((GetAsyncKeyState(Keys.K) & 0x8000) != 0 && (GetAsyncKeyState(Keys.Control) & 0x8000) != 0)
                        {
                            await LoadClipboardFromFirebase();
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

        private static async Task MonitorFirebaseAsync()
        {
            while (true)
            {
                try
                {
                    // Chỉ kiểm tra Firebase nếu tính năng được bật
                    if (client != null && enableFirebaseMonitoring)
                    {
                        var response = await client.GetAsync("test");
                        string currentValue = response?.Body?.ToString()?.Trim('"') ?? "";
                        
                        Debug.WriteLine($"Current value: {currentValue}, Last value: {lastTestValue}");
                        
                        if (currentValue == "1" && currentValue != lastTestValue)
                        {
                            Debug.WriteLine("Triggering Windows key press");
                            keybd_event(VK_LWIN, 0, 0, 0);
                            await Task.Delay(200);
                            keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0);
                            Debug.WriteLine("Windows key press completed");
                        }
                        
                        lastTestValue = currentValue;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Lỗi khi theo dõi Firebase: {ex.Message}");
                }
                await Task.Delay(500);
            }
        }

        [DllImport("user32.dll")]
        private static extern short GetAsyncKeyState(Keys vKey);

        private static async Task SaveToFirebase()
        {
            try
            {
                if (client != null)
                {
                    Debug.WriteLine("Starting SaveToFirebase");
                    
                    // Giả lập nhấn Ctrl+C
                    keybd_event((byte)Keys.Control, 0, 0, 0);
                    keybd_event(0x43, 0, 0, 0);  // 0x43 là mã phím C
                    await Task.Delay(100);
                    keybd_event(0x43, 0, KEYEVENTF_KEYUP, 0);
                    keybd_event((byte)Keys.Control, 0, KEYEVENTF_KEYUP, 0);
                    
                    // Đợi một chút để đảm bảo clipboard đã được cập nhật
                    await Task.Delay(200);
                    
                    // Lưu clipboard lên Firebase
                    await SaveClipboardToFirebase();
                    
                    // Đảm bảo xóa giá trị cũ trước
                    await client.DeleteAsync("test");
                    await Task.Delay(100);
                    
                    // Reset lastTestValue
                    lastTestValue = "";
                    
                    // Lưu giá trị "1" trong 5 giây
                    Debug.WriteLine("Setting test value to 1");
                    await client.SetAsync("test", "1");
                    await Task.Delay(5000);
                    
                    Debug.WriteLine("Deleting test value");
                    await client.DeleteAsync("test");
                    
                    Debug.WriteLine("SaveToFirebase completed");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Lỗi khi lưu vào Firebase: {ex.Message}");
            }
        }

        private static async Task SaveClipboardToFirebase()
        {
            try
            {
                string clipboardText = "";
                Thread staThread = new Thread(() =>
                {
                    try 
                    {
                        if (Clipboard.ContainsText(TextDataFormat.UnicodeText))
                        {
                            clipboardText = Clipboard.GetText(TextDataFormat.UnicodeText);
                        }
                    }
                    catch (Exception ex)
                    {
                        Debug.WriteLine($"Lỗi khi get clipboard: {ex.Message}");
                    }
                });
                staThread.SetApartmentState(ApartmentState.STA);
                staThread.Start();
                staThread.Join();

                if (!string.IsNullOrEmpty(clipboardText) && client != null)
                {
                    Debug.WriteLine($"Text trước khi encode: {clipboardText}");
                    
                    // Chuyển text sang bytes sử dụng UTF-16
                    byte[] textBytes = System.Text.Encoding.Unicode.GetBytes(clipboardText);
                    string base64Text = Convert.ToBase64String(textBytes);
                    
                    var dataObject = new
                    {
                        content = base64Text,
                        encoding = "utf16",
                        timestamp = DateTime.UtcNow.ToString("o")
                    };
                    
                    await client.SetAsync("clipboard", dataObject);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Lỗi khi lưu clipboard vào Firebase: {ex.Message}");
            }
        }

        private static async Task LoadClipboardFromFirebase()
        {
            try
            {
                if (client != null)
                {
                    var response = await client.GetAsync("clipboard");
                    if (!string.IsNullOrEmpty(response.Body))
                    {
                        dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(response.Body);
                        string base64Text = data.content.ToString();
                        
                        // Giải mã Base64 và chuyển đổi sang UTF-16
                        byte[] bytes = Convert.FromBase64String(base64Text);
                        string decodedText = System.Text.Encoding.Unicode.GetString(bytes);
                        
                        Debug.WriteLine($"Text sau khi decode: {decodedText}");
                        
                        Thread staThread = new Thread(() =>
                        {
                            try 
                            {
                                // Sử dụng DataObject để giữ nguyên định dạng text
                                IDataObject dataObject = new DataObject();
                                dataObject.SetData(DataFormats.UnicodeText, decodedText);
                                dataObject.SetData(DataFormats.Text, decodedText);
                                Clipboard.SetDataObject(dataObject, true, 5, 100);
                            }
                            catch (Exception ex)
                            {
                                Debug.WriteLine($"Lỗi khi set clipboard: {ex.Message}");
                            }
                        });
                        staThread.SetApartmentState(ApartmentState.STA);
                        staThread.Start();
                        staThread.Join();
                        
                        await Task.Delay(200);
                        
                        // Giả lập Ctrl+V
                        keybd_event((byte)Keys.Control, 0, 0, 0);
                        keybd_event(0x56, 0, 0, 0);
                        await Task.Delay(100);
                        keybd_event(0x56, 0, KEYEVENTF_KEYUP, 0);
                        keybd_event((byte)Keys.Control, 0, KEYEVENTF_KEYUP, 0);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Lỗi khi lấy clipboard từ Firebase: {ex.Message}");
            }
        }
    } //kết nối csdl

    public enum Keys
    {
        Control = 0x11,
        H = 0x48,
        J = 0x4A,
        K = 0x4B,
        V = 0x56,
        X = 0x58,
        ShiftKey = 0x10
    }
}