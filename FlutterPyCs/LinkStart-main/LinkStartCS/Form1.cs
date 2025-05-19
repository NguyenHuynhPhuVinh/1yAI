using System;
using System.Drawing;
using System.Windows.Forms;
using System.Threading;
using System.Threading.Tasks;
using FireSharp.Config;
using FireSharp.Interfaces;
using FireSharp.Response;

public partial class Form1 : Form
{
    private static IFirebaseClient client;
    private bool isRunning = false;

    private string pythonPath = "C:\\Users\\kotor\\Documents\\LinkStart\\LinkStartPython\\";
    private CancellationTokenSource cancellationTokenSource;

    public Form1()
    {
        InitializeComponent();
        btnStart.Click += BtnStart_Click;
        KeyPreview = true;
        KeyDown += Form1_KeyDown;
    }

    private async void BtnStart_Click(object sender, EventArgs e)
    {
        if (!isRunning)
        {
            btnStart.Enabled = false;
            lblStatus.Text = "Đang kết nối...";
            
            isRunning = true;
            cancellationTokenSource = new CancellationTokenSource();

            IFirebaseConfig config = new FirebaseConfig
            {
                AuthSecret = "y5KYvYGhHei338L0jIWmgHhR5B4oIEs9kybuky01",
                BasePath = "https://test-e61cd-default-rtdb.asia-southeast1.firebasedatabase.app/"
            };

            client = new FireSharp.FirebaseClient(config);

            if (client != null)
            {
                lblStatus.Text = "Đã kết nối. Đang chạy...";
                btnStart.Text = "ĐANG CHẠY";
                btnStart.BackColor = Color.FromArgb(76, 175, 80);
                await RunSlideControl(cancellationTokenSource.Token);
            }
            else
            {
                lblStatus.Text = "Kết nối thất bại!";
                btnStart.Enabled = true;
                isRunning = false;
            }
        }
    }

    private async Task RunSlideControl(CancellationToken token)
    {
        try
        {
            while (!token.IsCancellationRequested)
            {
                FirebaseResponse slideResponse = await client.GetAsync("slide");
                FirebaseResponse screenResponse = await client.GetAsync("screen");
                FirebaseResponse actionResponse = await client.GetAsync("action");
                
                int slideValue = slideResponse.ResultAs<int>();
                string screenValue = screenResponse.ResultAs<string>();
                string actionValue = actionResponse.ResultAs<string>();

                if (slideValue == 1)
                {
                    SendKeys.SendWait("{RIGHT}");
                    await client.SetAsync("slide", -1);
                }
                else if (slideValue == 0)
                {
                    SendKeys.SendWait("{LEFT}");
                    await client.SetAsync("slide", -1);
                }

                if (screenValue.StartsWith("login"))
                {
                    string userType = screenValue.Contains("admin") ? "admin" : "user";
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = $"{pythonPath}login_automation.py {userType}";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("screen", "");
                }
                else if (screenValue.StartsWith("qt"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    
                    string[] parts = screenValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}admin_handler.py {parts[1]}";
                    }
                    else if (parts.Length == 3)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}admin_handler.py {parts[1]} {parts[2]}";
                    }
                    
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("screen", "");
                }
                else if (actionValue.StartsWith("qlsp"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}QLSP.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("qlnv"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}QLNV.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("qlkh"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}QLKH.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("qltk"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}QLTK.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("qlncc"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}QLNCC.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("tcsp"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}TCSP.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("tcnv"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}TCNV.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("tckh"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}TCKH.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue.StartsWith("tctk"))
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    string[] parts = actionValue.Split('-');
                    if (parts.Length == 2)
                    {
                        process.StartInfo.Arguments = $"{pythonPath}TCTK.py {parts[1]}";
                    }
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue =="lhd")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = $"{pythonPath}LHD.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue =="nsp")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = $"{pythonPath}NSP.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue =="tt")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = $"{pythonPath}TT.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (actionValue =="bb")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = $"{pythonPath}BB.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("action", "");
                }
                else if (screenValue == "demo")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = pythonPath + "powerpoint_handler.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("screen", "");
                }
                else if (screenValue == "slide")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = pythonPath + "open_powerpoint_slide.py";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("screen", "");
                }
                else if (screenValue == "exit")
                {
                    System.Diagnostics.Process process = new System.Diagnostics.Process();
                    process.StartInfo.FileName = "python";
                    process.StartInfo.Arguments = pythonPath + "close_active_window.py ";
                    process.StartInfo.UseShellExecute = false;
                    process.StartInfo.RedirectStandardOutput = true;
                    process.StartInfo.CreateNoWindow = true;
                    process.Start();
                    
                    await client.SetAsync("screen", "");
                }

                await Task.Delay(100, token);
            }
        }
        catch (OperationCanceledException)
        {
            lblStatus.Text = "Đã dừng chương trình";
            btnStart.Text = "BẮT ĐẦU";
            btnStart.BackColor = Color.FromArgb(0, 122, 204);
            btnStart.Enabled = true;
        }
    }

    private void Form1_KeyDown(object sender, KeyEventArgs e)
    {
        if (e.Control && e.Shift && e.KeyCode == Keys.X)
        {
            if (isRunning)
            {
                cancellationTokenSource?.Cancel();
                isRunning = false;
            }
        }
    }
} 