namespace System203
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
            
            string hướngDẫn = "HƯỚNG DẪN SỬ DỤNG:\n\n" +
                              "Ctrl + H: Đưa vùng chọn lên Firebase\n\n" +
                              "Ctrl + K: Lấy vùng chọn từ Firebase\n\n" +
                              "Ctrl + J: Gửi vùng chọn tới Gemini AI\n\n" +
                              "Ctrl + Shift + X: Thoát chương trình";

            // Điều chỉnh label hướng dẫn
            Label lblGuide = new Label();
            lblGuide.Text = hướngDẫn;
            lblGuide.AutoSize = false;
            lblGuide.Size = new Size(420, 220);
            lblGuide.Location = new Point(15, 15);
            lblGuide.Font = new Font("Consolas", 12, FontStyle.Regular);
            lblGuide.ForeColor = Color.LightGreen;
            Controls.Add(lblGuide);

            // Điều chỉnh nút OK
            Button btnOK = CreateHackerButton("OK", 175, 240);
            btnOK.Size = new Size(100, 35);
            btnOK.Click += (s, e) => {
                this.Hide();
                NoUIProgram.Start();
            };
            
            Controls.Add(btnOK);
        }

        private void InitializeComponent()
        {
            SuspendLayout();
            // 
            // MainForm
            // 
            BackColor = Color.FromArgb(25, 25, 25);
            ClientSize = new Size(450, 290);
            ForeColor = Color.LightGreen;
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "System203";
            ResumeLayout(false);
        }

        private Button CreateHackerButton(string text, int x, int y)
        {
            Button btn = new Button();
            btn.Text = text;
            btn.Location = new System.Drawing.Point(x, y);
            btn.Size = new System.Drawing.Size(240, 40);
            btn.FlatStyle = FlatStyle.Flat;
            btn.BackColor = Color.FromArgb(45, 45, 45);
            btn.ForeColor = Color.LightGreen;
            btn.Font = new Font("Consolas", 10, FontStyle.Bold);
            btn.FlatAppearance.BorderColor = Color.LightGreen;
            btn.FlatAppearance.MouseOverBackColor = Color.FromArgb(60, 60, 60);
            btn.Cursor = Cursors.Hand;
            return btn;
        }
    }
} 