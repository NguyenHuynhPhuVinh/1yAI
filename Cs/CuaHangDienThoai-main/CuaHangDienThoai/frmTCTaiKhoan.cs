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
    public partial class frmTCTaiKhoan : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public frmTCTaiKhoan()
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
                    string query = "SELECT TenTaiKhoan, MaKhachHang, MaNhanVien, MatKhau, LoaiTaiKhoan FROM TaiKhoan" + filter;

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
                            dgvTaiKhoan.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvTaiKhoan.Rows.Add(
                                    row["TenTaiKhoan"],
                                    row["MaKhachHang"],
                                    row["MaNhanVien"],
                                    row["MatKhau"],
                                    row["LoaiTaiKhoan"]
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
            txtMaKhachHang.Enabled = isEnabled;
            txtMaNhanVien.Enabled = isEnabled;
            txtMatKhau.Enabled = isEnabled;
            cboLoaiTaiKhoan.Enabled = isEnabled;

            if (!isEnabled)
            {

                txtTenTaiKhoan.Text = "";
                txtMaKhachHang.Text = "";
                txtMaNhanVien.Text = "";
                txtMatKhau.Text = "";
                cboLoaiTaiKhoan.SelectedIndex = -1;
            }
        }

        private void btnTimKiem_Click(object sender, EventArgs e)
        {
            string filter = " WHERE 1=1";

            if (!string.IsNullOrEmpty(txtTenTaiKhoan.Text))
            {
                filter += " AND TenTaiKhoan LIKE N'%" + txtTenTaiKhoan.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtMaKhachHang.Text))
            {
                filter += " AND MaKhachHang LIKE N'%" + txtMaKhachHang.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtMaNhanVien.Text))
            {
                filter += " AND MaNhanVien LIKE N'%" + txtMaNhanVien.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtMatKhau.Text))
            {
                filter += " AND MatKhau LIKE N'%" + txtMatKhau.Text + "%'";
            }
            if (cboLoaiTaiKhoan.SelectedIndex != -1)
            {
                filter += " AND LoaiTaiKhoan = '" + cboLoaiTaiKhoan.SelectedItem.ToString() + "'";
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

        private void LoadLoaiTaiKhoan()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT DISTINCT LoaiTaiKhoan FROM TaiKhoan"; // Get unique account types
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                cboLoaiTaiKhoan.Items.Add(reader["LoaiTaiKhoan"].ToString());
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

        private void frmTCTaiKhoan_Load(object sender, EventArgs e)
        {
            LoadLoaiTaiKhoan();
        }
    }
}