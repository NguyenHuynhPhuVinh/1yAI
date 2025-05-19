using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CuaHangDienThoai
{
    public partial class frmTCKhachHang : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public frmTCKhachHang()
        {
            InitializeComponent();
            AnHienTextBox(false);
            btnTimKiem.Enabled = true;
        }

        private void LoadData(string filter = "")
        {
            // Tạo kết nối
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    // Mở kết nối
                    connection.Open();

                    // Tạo câu truy vấn
                    string query = "SELECT MaKhachHang, TenTaiKhoan, TenKhachHang, DiaChi, SoDienThoai, Email FROM KhachHang" + filter;

                    // Tạo đối tượng SqlCommand
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        // Tạo đối tượng SqlDataAdapter
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            // Tạo DataTable để chứa dữ liệu
                            DataTable dataTable = new DataTable();

                            // Đổ dữ liệu vào DataTable
                            adapter.Fill(dataTable);

                            // Hiển thị dữ liệu lên DataGridView
                            dgvKhachHang.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvKhachHang.Rows.Add(
                                    row["MaKhachHang"],
                                    row["TenTaiKhoan"],
                                    row["TenKhachHang"],
                                    row["DiaChi"],
                                    row["SoDienThoai"],
                                    row["Email"]
                                );
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }
        private void AnHienTextBox(bool isEnabled)
        {

            txtTenTaiKhoan.Enabled = isEnabled;
            txtTenKhachHang.Enabled = isEnabled;
            txtDiaChi.Enabled = isEnabled;
            txtSoDienThoai.Enabled = isEnabled;
            txtEmail.Enabled = isEnabled;

            if (!isEnabled)
            {

                txtTenTaiKhoan.Text = "";
                txtTenKhachHang.Text = "";
                txtDiaChi.Text = "";
                txtSoDienThoai.Text = "";
                txtEmail.Text = "";
            }
        }

        private void btnTimKiem_Click(object sender, EventArgs e)
        {
            string filter = " WHERE 1=1";

            if (!string.IsNullOrEmpty(txtTenTaiKhoan.Text))
            {
                filter += " AND TenTaiKhoan LIKE N'%" + txtTenTaiKhoan.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtTenKhachHang.Text))
            {
                filter += " AND TenKhachHang LIKE N'%" + txtTenKhachHang.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtDiaChi.Text))
            {
                filter += " AND DiaChi LIKE N'%" + txtDiaChi.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtSoDienThoai.Text))
            {
                filter += " AND SoDienThoai LIKE N'%" + txtSoDienThoai.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtEmail.Text))
            {
                filter += " AND Email LIKE N'%" + txtEmail.Text + "%'";
            }

            LoadData(filter);
            AnHienTextBox(false);
        }

        private void btnHienThiTatCa_Click(object sender, EventArgs e)
        {
            LoadData();
            AnHienTextBox(false);
        }

        private void btnLamMoi_Click(object sender, EventArgs e)
        {
            AnHienTextBox(true);
        }
    }
}