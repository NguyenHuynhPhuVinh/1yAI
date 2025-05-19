using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace CuaHangDienThoai
{
    public partial class Form1 : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public Form1()
        {
            InitializeComponent();
            // Thêm sự kiện để cập nhật label khi form được resize
            this.Resize += new EventHandler(Form1_Resize);
        }

        private void Form1_Paint(object sender, PaintEventArgs e)
        {
            GraphicsPath path = new GraphicsPath();
            int radius = 30; 
            Rectangle rect = new Rectangle(0, 0, this.Width, this.Height);
            path.AddArc(rect.X, rect.Y, radius, radius, 180, 90); 
            path.AddArc(rect.X + rect.Width - radius, rect.Y, radius, radius, 270, 90); 
            path.AddArc(rect.X + rect.Width - radius, rect.Y + rect.Height - radius, radius, radius, 0, 90); 
            path.AddArc(rect.X, rect.Y + rect.Height - radius, radius, radius, 90, 90); 
            path.CloseFigure();
            this.Region = new Region(path);
        }

        private void btnClose_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void txtUsername_Enter(object sender, EventArgs e)
        {
            if (txtUsername.Text == "   Tên đăng nhập")
            {
                txtUsername.Text = "";
                txtUsername.ForeColor = Color.White; 
            }
        }

        private void txtUsername_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtUsername.Text))
            {
                txtUsername.Text = "   Tên đăng nhập";
                txtUsername.ForeColor = Color.FromArgb(158, 161, 176); 
            }
        }

        private void txtPassword_Enter(object sender, EventArgs e)
        {
            if (txtPassword.Text == "   Mật khẩu")
            {
                txtPassword.Text = "";
                txtPassword.ForeColor = Color.White; 
                txtPassword.UseSystemPasswordChar = true;
            }
        }

        private void txtPassword_Leave(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtPassword.Text))
            {
                txtPassword.Text = "   Mật khẩu";
                txtPassword.ForeColor = Color.FromArgb(158, 161, 176); 
                txtPassword.UseSystemPasswordChar = false;
            }
        }

        private void RoundedPanel_Paint(object sender, PaintEventArgs e)
        {
            Panel panel = (Panel)sender;
            using (GraphicsPath path = new GraphicsPath())
            {
                int radius = 20; 
                Rectangle rect = new Rectangle(0, 0, panel.Width - 1, panel.Height - 1);
                path.AddArc(rect.X, rect.Y, radius, radius, 180, 90); 
                path.AddArc(rect.X + rect.Width - radius, rect.Y, radius, radius, 270, 90); 
                path.AddArc(rect.X + rect.Width - radius, rect.Y + rect.Height - radius, radius, radius, 0, 90); 
                path.AddArc(rect.X, rect.Y + rect.Height - radius, radius, radius, 90, 90); 
                path.CloseFigure();

                panel.Region = new Region(path);

                using (Pen pen = new Pen(Color.FromArgb(24, 30, 54), 2)) 
                {
                    e.Graphics.DrawPath(pen, path);
                }
            }
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ClassStyle |= 0x20000; 
                return cp;
            }
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT LoaiTaiKhoan FROM TaiKhoan WHERE TenTaiKhoan = @TenTaiKhoan AND MatKhau = @MatKhau";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@TenTaiKhoan", txtUsername.Text);
                        command.Parameters.AddWithValue("@MatKhau", txtPassword.Text);
                        object result = command.ExecuteScalar();
                        if (result != null)
                        {
                            string role = result.ToString();
                            frmQuanTri frm = new frmQuanTri(role);
                            this.Hide();
                            frm.ShowDialog();
                            this.Show();
                        }
                        else
                        {
                            MessageBox.Show("Sai tên đăng nhập hoặc mật khẩu!");
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }

        private void btnClose_MouseEnter(object sender, EventArgs e)
        {
            btnClose.BackColor = Color.Red; 
        }

        private void btnClose_MouseLeave(object sender, EventArgs e)
        {
            btnClose.BackColor = Color.Transparent; 
        }

        private void btnLogin_MouseEnter(object sender, EventArgs e)
        {
            btnLogin.BackColor = Color.FromArgb(0, 85, 170); 
        }

        private void btnLogin_MouseLeave(object sender, EventArgs e)
        {
            btnLogin.BackColor = Color.FromArgb(0, 126, 249); 
        }
        private void Form1_Resize(object sender, EventArgs e)
        {
            // Cập nhật vị trí của label bản quyền
            lblCopyright.Location = new Point(21, this.ClientSize.Height - lblCopyright.Height - 10);
        }
    }
}