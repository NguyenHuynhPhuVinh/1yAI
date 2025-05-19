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
    public partial class frmTCSanPham : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public frmTCSanPham()
        {
            InitializeComponent();
            LoadDataToComboBox();
            AnHienTextBox(false);
            btnTimKiem.Enabled = true;
        }

        private void LoadDataToComboBox()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaHang, TenHang FROM HangSanXuat";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            // Thêm dòng "Tất cả" vào đầu danh sách
                            DataRow allRow = dataTable.NewRow();
                            allRow["MaHang"] = DBNull.Value;
                            allRow["TenHang"] = "Tất cả";
                            dataTable.Rows.InsertAt(allRow, 0);

                            cboMaHang.DataSource = dataTable;
                            cboMaHang.DisplayMember = "TenHang";
                            cboMaHang.ValueMember = "MaHang";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
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
                    string query = "SELECT * FROM SanPham" + filter;

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
                            dgvSanPham.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvSanPham.Rows.Add(
                                    row["MaSanPham"],
                                    row["MaHang"],
                                    row["TenSanPham"],
                                    row["MoTa"],
                                    row["GiaBan"],
                                    row["SoLuongTonKho"],
                                    row["MauSac"],
                                    row["DungLuong"],
                                    row["HeDieuHanh"],
                                    row["KichThuocManHinh"]
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
            
            cboMaHang.Enabled = isEnabled;
            txtTenSanPham.Enabled = isEnabled;
            txtMoTa.Enabled = isEnabled;
            txtGiaBan.Enabled = isEnabled;
            txtSoLuong.Enabled = isEnabled;
            txtMauSac.Enabled = isEnabled;
            txtDungLuong.Enabled = isEnabled;
            txtHeDieuHanh.Enabled = isEnabled;
            txtKichThuoc.Enabled = isEnabled;
            

            if (!isEnabled)
            {
                
                cboMaHang.SelectedIndex = 0;
                txtTenSanPham.Text = "";
                txtMoTa.Text = "";
                txtGiaBan.Text = "";
                txtSoLuong.Text = "";
                txtMauSac.Text = "";
                txtDungLuong.Text = "";
                txtHeDieuHanh.Text = "";
                txtKichThuoc.Text = "";
            }
        }

        private void btnTimKiem_Click(object sender, EventArgs e)
        {
            string filter = " WHERE 1=1";

            if (cboMaHang.SelectedIndex != 0)
            {
                filter += " AND MaHang = '" + cboMaHang.SelectedValue + "'";
            }
            if (!string.IsNullOrEmpty(txtTenSanPham.Text))
            {
                filter += " AND TenSanPham LIKE N'%" + txtTenSanPham.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtMoTa.Text))
            {
                filter += " AND MoTa LIKE N'%" + txtMoTa.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtGiaBan.Text))
            {
                filter += " AND GiaBan = " + txtGiaBan.Text;
            }
            if (!string.IsNullOrEmpty(txtSoLuong.Text))
            {
                filter += " AND SoLuongTonKho = " + txtSoLuong.Text;
            }
            if (!string.IsNullOrEmpty(txtMauSac.Text))
            {
                filter += " AND MauSac LIKE N'%" + txtMauSac.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtDungLuong.Text))
            {
                filter += " AND DungLuong LIKE N'%" + txtDungLuong.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtHeDieuHanh.Text))
            {
                filter += " AND HeDieuHanh LIKE N'%" + txtHeDieuHanh.Text + "%'";
            }
            if (!string.IsNullOrEmpty(txtKichThuoc.Text))
            {
                filter += " AND KichThuocManHinh LIKE N'%" + txtKichThuoc.Text + "%'";
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