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
    public partial class frmQLHangSanXuat : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        // Biến để theo dõi trạng thái thêm mới hay sửa
        bool isAdding = false;

        public frmQLHangSanXuat()
        {
            InitializeComponent();
            LoadData();
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
                    string query = "SELECT * FROM HangSanXuat";

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
                            dgvHangSanXuat.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvHangSanXuat.Rows.Add(
                                    row["MaHang"],
                                    row["TenHang"]
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

        private void btnThem_Click(object sender, EventArgs e)
        {
            AnHienTextBox(true);
            dgvHangSanXuat.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true; // Đặt trạng thái là thêm mới
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaHang.Text))
            {
                MessageBox.Show("Vui lòng nhập mã hãng.");
                return;
            }
            if (string.IsNullOrEmpty(txtTenHang.Text))
            {
                MessageBox.Show("Vui lòng nhập tên hãng.");
                return;
            }
            if (isAdding) // Thêm mới
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO HangSanXuat (MaHang, TenHang) VALUES (@MaHang, @TenHang)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            // Thêm tham số
                            command.Parameters.AddWithValue("@MaHang", txtMaHang.Text);
                            command.Parameters.AddWithValue("@TenHang", txtTenHang.Text);

                            // Thực thi câu truy vấn
                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm hãng sản xuất thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvHangSanXuat.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false; // Đặt lại trạng thái
                            }
                            else
                            {
                                MessageBox.Show("Thêm hãng sản xuất thất bại!");
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

                        string query = "UPDATE HangSanXuat SET TenHang = @TenHang WHERE MaHang = @MaHang";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            // Thêm tham số
                            command.Parameters.AddWithValue("@MaHang", txtMaHang.Text);
                            command.Parameters.AddWithValue("@TenHang", txtTenHang.Text);

                            // Thực thi câu truy vấn
                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật hãng sản xuất thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvHangSanXuat.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true; 
                                isAdding = false; // Đặt lại trạng thái
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật hãng sản xuất thất bại!");
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
            dgvHangSanXuat.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
            isAdding = false;
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvHangSanXuat.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvHangSanXuat.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false; // Đặt trạng thái là sửa

                DataGridViewRow selectedRow = dgvHangSanXuat.SelectedRows[0];
                txtMaHang.Text = selectedRow.Cells["MaHang"].Value.ToString();
                txtTenHang.Text = selectedRow.Cells["TenHang"].Value.ToString();

                txtMaHang.Enabled = false; // Không cho sửa mã hãng
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một hãng sản xuất để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvHangSanXuat.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa hãng sản xuất này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string maHang = dgvHangSanXuat.SelectedRows[0].Cells["MaHang"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            // Kiểm tra xem có sản phẩm nào đang sử dụng hãng này không
                            string checkQuery = "SELECT COUNT(*) FROM SanPham WHERE MaHang = @MaHang";
                            using (SqlCommand checkCommand = new SqlCommand(checkQuery, connection))
                            {
                                checkCommand.Parameters.AddWithValue("@MaHang", maHang);
                                int count = (int)checkCommand.ExecuteScalar();

                                if (count > 0)
                                {
                                    // Xóa sản phẩm liên quan
                                    if (MessageBox.Show($"Có {count} sản phẩm thuộc hãng này. Bạn có muốn xóa các sản phẩm liên quan trước?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                                    {
                                        string deleteSanPhamQuery = "DELETE FROM SanPham WHERE MaHang = @MaHang";
                                        using (SqlCommand deleteSanPhamCommand = new SqlCommand(deleteSanPhamQuery, connection))
                                        {
                                            deleteSanPhamCommand.Parameters.AddWithValue("@MaHang", maHang);
                                            deleteSanPhamCommand.ExecuteNonQuery();
                                        }
                                    }
                                    else
                                    {
                                        return; // Không xóa hãng nếu người dùng không đồng ý xóa sản phẩm
                                    }
                                }
                            }

                            // Xóa hãng sản xuất
                            string deleteQuery = "DELETE FROM HangSanXuat WHERE MaHang = @MaHang";
                            using (SqlCommand command = new SqlCommand(deleteQuery, connection))
                            {
                                command.Parameters.AddWithValue("@MaHang", maHang);
                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa hãng sản xuất thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa hãng sản xuất thất bại!");
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
                MessageBox.Show("Vui lòng chọn một hãng sản xuất để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtMaHang.Enabled = isEnabled;
            txtTenHang.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtMaHang.Text = "";
                txtTenHang.Text = "";
            }
        }

        private void dgvHangSanXuat_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvHangSanXuat.Rows.Count)
            {
                DataGridViewRow row = dgvHangSanXuat.Rows[e.RowIndex];
                txtMaHang.Text = row.Cells["MaHang"].Value?.ToString();
                txtTenHang.Text = row.Cells["TenHang"].Value?.ToString();
            }
        }
    }
}