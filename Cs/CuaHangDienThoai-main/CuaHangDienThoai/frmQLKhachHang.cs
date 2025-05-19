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
    public partial class frmQLKhachHang : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        bool isAdding = false;

        public frmQLKhachHang()
        {
            InitializeComponent();
            LoadData();
            AnHienTextBox(false);
        }

        private void LoadData()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT * FROM KhachHang";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

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

        private void btnThem_Click(object sender, EventArgs e)
        {
            AnHienTextBox(true);
            dgvKhachHang.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true;
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaKhachHang.Text))
            {
                MessageBox.Show("Vui lòng nhập mã khách hàng.");
                return;
            }

            if (isAdding)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO KhachHang (MaKhachHang, TenTaiKhoan, TenKhachHang, DiaChi, SoDienThoai, Email) VALUES (@MaKhachHang, @TenTaiKhoan, @TenKhachHang, @DiaChi, @SoDienThoai, @Email)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaKhachHang", txtMaKhachHang.Text);
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@TenKhachHang", txtTenKhachHang.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm khách hàng thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvKhachHang.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Thêm khách hàng thất bại!");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
            else
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "UPDATE KhachHang SET TenTaiKhoan = @TenTaiKhoan, TenKhachHang = @TenKhachHang, DiaChi = @DiaChi, SoDienThoai = @SoDienThoai, Email = @Email WHERE MaKhachHang = @MaKhachHang";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaKhachHang", txtMaKhachHang.Text);
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@TenKhachHang", txtTenKhachHang.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật khách hàng thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvKhachHang.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật khách hàng thất bại!");
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
            dgvKhachHang.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
            isAdding = false;
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvKhachHang.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvKhachHang.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false;

                DataGridViewRow selectedRow = dgvKhachHang.SelectedRows[0];
                txtMaKhachHang.Text = selectedRow.Cells["MaKhachHang"].Value.ToString();
                txtTenTaiKhoan.Text = selectedRow.Cells["TenTaiKhoan"].Value.ToString();
                txtTenKhachHang.Text = selectedRow.Cells["TenKhachHang"].Value.ToString();
                txtDiaChi.Text = selectedRow.Cells["DiaChi"].Value.ToString();
                txtSoDienThoai.Text = selectedRow.Cells["SoDienThoai"].Value.ToString();
                txtEmail.Text = selectedRow.Cells["Email"].Value.ToString();

                txtMaKhachHang.Enabled = false;
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một khách hàng để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvKhachHang.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa khách hàng này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string maKhachHang = dgvKhachHang.SelectedRows[0].Cells["MaKhachHang"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string query = "DELETE FROM KhachHang WHERE MaKhachHang = @MaKhachHang";

                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                command.Parameters.AddWithValue("@MaKhachHang", maKhachHang);

                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa khách hàng thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa khách hàng thất bại!");
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
                MessageBox.Show("Vui lòng chọn một khách hàng để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtMaKhachHang.Enabled = isEnabled;
            txtTenTaiKhoan.Enabled = isEnabled;
            txtTenKhachHang.Enabled = isEnabled;
            txtDiaChi.Enabled = isEnabled;
            txtSoDienThoai.Enabled = isEnabled;
            txtEmail.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtMaKhachHang.Text = "";
                txtTenTaiKhoan.Text = "";
                txtTenKhachHang.Text = "";
                txtDiaChi.Text = "";
                txtSoDienThoai.Text = "";
                txtEmail.Text = "";
            }
        }

        private void dgvKhachHang_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvKhachHang.Rows.Count)
            {
                DataGridViewRow row = dgvKhachHang.Rows[e.RowIndex];
                txtMaKhachHang.Text = row.Cells["MaKhachHang"].Value?.ToString();
                txtTenTaiKhoan.Text = row.Cells["TenTaiKhoan"].Value?.ToString();
                txtTenKhachHang.Text = row.Cells["TenKhachHang"].Value?.ToString();
                txtDiaChi.Text = row.Cells["DiaChi"].Value?.ToString();
                txtSoDienThoai.Text = row.Cells["SoDienThoai"].Value?.ToString();
                txtEmail.Text = row.Cells["Email"].Value?.ToString();
            }
        }
    }
}