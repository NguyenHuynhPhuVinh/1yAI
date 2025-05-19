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
    public partial class frmQLNhanVien : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        bool isAdding = false;

        public frmQLNhanVien()
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
                    string query = "SELECT * FROM NhanVien";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            dgvNhanVien.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvNhanVien.Rows.Add(
                                    row["MaNhanVien"],
                                    row["TenTaiKhoan"],
                                    row["TenNhanVien"],
                                    row["DiaChi"],
                                    row["SoDienThoai"],
                                    row["Email"],
                                    row["ChucVu"]
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
            dgvNhanVien.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true;
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaNhanVien.Text))
            {
                MessageBox.Show("Vui lòng nhập mã nhân viên.");
                return;
            }

            if (isAdding)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO NhanVien (MaNhanVien, TenTaiKhoan, TenNhanVien, DiaChi, SoDienThoai, Email, ChucVu) VALUES (@MaNhanVien, @TenTaiKhoan, @TenNhanVien, @DiaChi, @SoDienThoai, @Email, @ChucVu)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaNhanVien", txtMaNhanVien.Text);
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@TenNhanVien", txtTenNhanVien.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);
                            command.Parameters.AddWithValue("@ChucVu", txtChucVu.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm nhân viên thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvNhanVien.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Thêm nhân viên thất bại!");
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

                        string query = "UPDATE NhanVien SET TenTaiKhoan = @TenTaiKhoan, TenNhanVien = @TenNhanVien, DiaChi = @DiaChi, SoDienThoai = @SoDienThoai, Email = @Email, ChucVu = @ChucVu WHERE MaNhanVien = @MaNhanVien";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaNhanVien", txtMaNhanVien.Text);
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@TenNhanVien", txtTenNhanVien.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);
                            command.Parameters.AddWithValue("@ChucVu", txtChucVu.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật nhân viên thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvNhanVien.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật nhân viên thất bại!");
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
            dgvNhanVien.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
            isAdding = false;
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvNhanVien.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvNhanVien.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false;

                DataGridViewRow selectedRow = dgvNhanVien.SelectedRows[0];
                txtMaNhanVien.Text = selectedRow.Cells["MaNhanVien"].Value.ToString();
                txtTenTaiKhoan.Text = selectedRow.Cells["TenTaiKhoan"].Value.ToString();
                txtTenNhanVien.Text = selectedRow.Cells["TenNhanVien"].Value.ToString();
                txtDiaChi.Text = selectedRow.Cells["DiaChi"].Value.ToString();
                txtSoDienThoai.Text = selectedRow.Cells["SoDienThoai"].Value.ToString();
                txtEmail.Text = selectedRow.Cells["Email"].Value.ToString();
                txtChucVu.Text = selectedRow.Cells["ChucVu"].Value.ToString();

                txtMaNhanVien.Enabled = false;
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một nhân viên để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvNhanVien.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa nhân viên này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string maNhanVien = dgvNhanVien.SelectedRows[0].Cells["MaNhanVien"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string query = "DELETE FROM NhanVien WHERE MaNhanVien = @MaNhanVien";

                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                command.Parameters.AddWithValue("@MaNhanVien", maNhanVien);

                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa nhân viên thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa nhân viên thất bại!");
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
                MessageBox.Show("Vui lòng chọn một nhân viên để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtMaNhanVien.Enabled = isEnabled;
            txtTenTaiKhoan.Enabled = isEnabled;
            txtTenNhanVien.Enabled = isEnabled;
            txtDiaChi.Enabled = isEnabled;
            txtSoDienThoai.Enabled = isEnabled;
            txtEmail.Enabled = isEnabled;
            txtChucVu.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtMaNhanVien.Text = "";
                txtTenTaiKhoan.Text = "";
                txtTenNhanVien.Text = "";
                txtDiaChi.Text = "";
                txtSoDienThoai.Text = "";
                txtEmail.Text = "";
                txtChucVu.Text = "";
            }
        }

        private void dgvNhanVien_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvNhanVien.Rows.Count)
            {
                DataGridViewRow row = dgvNhanVien.Rows[e.RowIndex];
                txtMaNhanVien.Text = row.Cells["MaNhanVien"].Value?.ToString();
                txtTenTaiKhoan.Text = row.Cells["TenTaiKhoan"].Value?.ToString();
                txtTenNhanVien.Text = row.Cells["TenNhanVien"].Value?.ToString();
                txtDiaChi.Text = row.Cells["DiaChi"].Value?.ToString();
                txtSoDienThoai.Text = row.Cells["SoDienThoai"].Value?.ToString();
                txtEmail.Text = row.Cells["Email"].Value?.ToString();
                txtChucVu.Text = row.Cells["ChucVu"].Value?.ToString();
            }
        }
    }
}