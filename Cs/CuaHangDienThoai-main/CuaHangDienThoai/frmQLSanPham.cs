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
    public partial class frmQLSanPham : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        // Biến để theo dõi trạng thái thêm mới hay sửa
        bool isAdding = false;

        public frmQLSanPham()
        {
            InitializeComponent();
            LoadData();
            LoadDataToComboBox();
            AnHienTextBox(false);

        }

        private void LoadData()
        {
            // Tạo kết nối
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    // Mở kết nối
                    connection.Open();

                    // Tạo câu truy vấn
                    string query = "SELECT * FROM SanPham";

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

        private void btnThem_Click(object sender, EventArgs e)
        {
            AnHienTextBox(true);
            dgvSanPham.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true; // Đặt trạng thái là thêm mới
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaSanPham.Text))
            {
                MessageBox.Show("Vui lòng nhập mã sản phẩm.");
                return;
            }

            if (isAdding) // Thêm mới
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO SanPham (MaSanPham, MaHang, TenSanPham, MoTa, GiaBan, SoLuongTonKho, MauSac, DungLuong, HeDieuHanh, KichThuocManHinh) VALUES (@MaSanPham, @MaHang, @TenSanPham, @MoTa, @GiaBan, @SoLuongTonKho, @MauSac, @DungLuong, @HeDieuHanh, @KichThuocManHinh)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            // Thêm tham số
                            command.Parameters.AddWithValue("@MaSanPham", txtMaSanPham.Text);
                            command.Parameters.AddWithValue("@MaHang", cboMaHang.SelectedValue);
                            command.Parameters.AddWithValue("@TenSanPham", txtTenSanPham.Text);
                            command.Parameters.AddWithValue("@MoTa", txtMoTa.Text);
                            command.Parameters.AddWithValue("@GiaBan", decimal.Parse(txtGiaBan.Text));
                            command.Parameters.AddWithValue("@SoLuongTonKho", int.Parse(txtSoLuong.Text));
                            command.Parameters.AddWithValue("@MauSac", txtMauSac.Text);
                            command.Parameters.AddWithValue("@DungLuong", txtDungLuong.Text);
                            command.Parameters.AddWithValue("@HeDieuHanh", txtHeDieuHanh.Text);
                            command.Parameters.AddWithValue("@KichThuocManHinh", txtKichThuoc.Text);

                            // Thực thi câu truy vấn
                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm sản phẩm thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvSanPham.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false; // Đặt lại trạng thái
                            }
                            else
                            {
                                MessageBox.Show("Thêm sản phẩm thất bại!");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
            else // Sửa
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "UPDATE SanPham SET MaHang = @MaHang, TenSanPham = @TenSanPham, MoTa = @MoTa, GiaBan = @GiaBan, SoLuongTonKho = @SoLuongTonKho, MauSac = @MauSac, DungLuong = @DungLuong, HeDieuHanh = @HeDieuHanh, KichThuocManHinh = @KichThuocManHinh WHERE MaSanPham = @MaSanPham";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            // Thêm tham số
                            command.Parameters.AddWithValue("@MaSanPham", txtMaSanPham.Text);
                            command.Parameters.AddWithValue("@MaHang", cboMaHang.SelectedValue);
                            command.Parameters.AddWithValue("@TenSanPham", txtTenSanPham.Text);
                            command.Parameters.AddWithValue("@MoTa", txtMoTa.Text);
                            command.Parameters.AddWithValue("@GiaBan", decimal.Parse(txtGiaBan.Text));
                            command.Parameters.AddWithValue("@SoLuongTonKho", int.Parse(txtSoLuong.Text));
                            command.Parameters.AddWithValue("@MauSac", txtMauSac.Text);
                            command.Parameters.AddWithValue("@DungLuong", txtDungLuong.Text);
                            command.Parameters.AddWithValue("@HeDieuHanh", txtHeDieuHanh.Text);
                            command.Parameters.AddWithValue("@KichThuocManHinh", txtKichThuoc.Text);

                            // Thực thi câu truy vấn
                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật sản phẩm thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvSanPham.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true; // Thêm dòng này để kích hoạt lại nút Thêm
                                isAdding = false; // Đặt lại trạng thái
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật sản phẩm thất bại!");
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

        private void btnHuy_Click(object sender, EventArgs e)
        {
            AnHienTextBox(false);
            dgvSanPham.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
             isAdding = false;
        }
        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvSanPham.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvSanPham.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false; // Đặt trạng thái là sửa

                DataGridViewRow selectedRow = dgvSanPham.SelectedRows[0];
                txtMaSanPham.Text = selectedRow.Cells["MaSanPham"].Value.ToString();
                cboMaHang.SelectedValue = selectedRow.Cells["MaHang"].Value;
                txtTenSanPham.Text = selectedRow.Cells["TenSanPham"].Value.ToString();
                txtMoTa.Text = selectedRow.Cells["MoTa"].Value.ToString();
                txtGiaBan.Text = selectedRow.Cells["GiaBan"].Value.ToString();
                txtSoLuong.Text = selectedRow.Cells["SoLuongTonKho"].Value.ToString();
                txtMauSac.Text = selectedRow.Cells["MauSac"].Value.ToString();
                txtDungLuong.Text = selectedRow.Cells["DungLuong"].Value.ToString();
                txtHeDieuHanh.Text = selectedRow.Cells["HeDieuHanh"].Value.ToString();
                txtKichThuoc.Text = selectedRow.Cells["KichThuocManHinh"].Value.ToString();

                txtMaSanPham.Enabled = false; // Không cho sửa mã sản phẩm
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một sản phẩm để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvSanPham.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa sản phẩm này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string maSanPham = dgvSanPham.SelectedRows[0].Cells["MaSanPham"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string query = "DELETE FROM SanPham WHERE MaSanPham = @MaSanPham";

                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                command.Parameters.AddWithValue("@MaSanPham", maSanPham);

                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa sản phẩm thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa sản phẩm thất bại!");
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
            else
            {
                MessageBox.Show("Vui lòng chọn một sản phẩm để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtMaSanPham.Enabled = isEnabled;
            cboMaHang.Enabled = isEnabled;
            txtTenSanPham.Enabled = isEnabled;
            txtMoTa.Enabled = isEnabled;
            txtGiaBan.Enabled = isEnabled;
            txtSoLuong.Enabled = isEnabled;
            txtMauSac.Enabled = isEnabled;
            txtDungLuong.Enabled = isEnabled;
            txtHeDieuHanh.Enabled = isEnabled;
            txtKichThuoc.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtMaSanPham.Text = "";
                cboMaHang.SelectedIndex = -1;
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
        private void dgvSanPham_CellClick(object sender, DataGridViewCellEventArgs e)
        {
             if (e.RowIndex >= 0 && e.RowIndex < dgvSanPham.Rows.Count)
            {
                DataGridViewRow row = dgvSanPham.Rows[e.RowIndex];
                txtMaSanPham.Text = row.Cells["MaSanPham"].Value?.ToString();
                cboMaHang.SelectedValue = row.Cells["MaHang"].Value;
                txtTenSanPham.Text = row.Cells["TenSanPham"].Value?.ToString();
                txtMoTa.Text = row.Cells["MoTa"].Value?.ToString();
                txtGiaBan.Text = row.Cells["GiaBan"].Value?.ToString();
                txtSoLuong.Text = row.Cells["SoLuongTonKho"].Value?.ToString();
                txtMauSac.Text = row.Cells["MauSac"].Value?.ToString();
                txtDungLuong.Text = row.Cells["DungLuong"].Value?.ToString();
                txtHeDieuHanh.Text = row.Cells["HeDieuHanh"].Value?.ToString();
                txtKichThuoc.Text = row.Cells["KichThuocManHinh"].Value?.ToString();
            }
        }

        private void btnQLHang_Click(object sender, EventArgs e)
        {
            frmQLHangSanXuat frm = new frmQLHangSanXuat();
            frm.FormClosed += Frm_FormClosed;
            frm.ShowDialog();
        }

        private void Frm_FormClosed(object sender, FormClosedEventArgs e)
        {
            LoadDataToComboBox();
        }
    }
}