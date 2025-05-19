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
    public partial class frmQLTaiKhoan : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        bool isAdding = false;

        public frmQLTaiKhoan()
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
                    string query = "SELECT * FROM TaiKhoan";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

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

        private void btnThem_Click(object sender, EventArgs e)
        {
            AnHienTextBox(true);
            dgvTaiKhoan.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true;
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtTenTaiKhoan.Text))
            {
                MessageBox.Show("Vui lòng nhập tên tài khoản.");
                return;
            }

            if (isAdding)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO TaiKhoan (TenTaiKhoan, MaKhachHang, MaNhanVien, MatKhau, LoaiTaiKhoan) VALUES (@TenTaiKhoan, @MaKhachHang, @MaNhanVien, @MatKhau, @LoaiTaiKhoan)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@MaKhachHang", txtMaKhachHang.Text);
                            command.Parameters.AddWithValue("@MaNhanVien", txtMaNhanVien.Text);
                            command.Parameters.AddWithValue("@MatKhau", txtMatKhau.Text);
                            command.Parameters.AddWithValue("@LoaiTaiKhoan", txtLoaiTaiKhoan.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm tài khoản thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvTaiKhoan.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Thêm tài khoản thất bại!");
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

                        string query = "UPDATE TaiKhoan SET MaKhachHang = @MaKhachHang, MaNhanVien = @MaNhanVien, MatKhau = @MatKhau, LoaiTaiKhoan = @LoaiTaiKhoan WHERE TenTaiKhoan = @TenTaiKhoan";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@TenTaiKhoan", txtTenTaiKhoan.Text);
                            command.Parameters.AddWithValue("@MaKhachHang", txtMaKhachHang.Text);
                            command.Parameters.AddWithValue("@MaNhanVien", txtMaNhanVien.Text);
                            command.Parameters.AddWithValue("@MatKhau", txtMatKhau.Text);
                            command.Parameters.AddWithValue("@LoaiTaiKhoan", txtLoaiTaiKhoan.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật tài khoản thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvTaiKhoan.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật tài khoản thất bại!");
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
            dgvTaiKhoan.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
            isAdding = false;
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvTaiKhoan.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvTaiKhoan.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false;

                DataGridViewRow selectedRow = dgvTaiKhoan.SelectedRows[0];
                txtTenTaiKhoan.Text = selectedRow.Cells["TenTaiKhoan"].Value.ToString();
                txtMaKhachHang.Text = selectedRow.Cells["MaKhachHang"].Value.ToString();
                txtMaNhanVien.Text = selectedRow.Cells["MaNhanVien"].Value.ToString();
                txtMatKhau.Text = selectedRow.Cells["MatKhau"].Value.ToString();
                txtLoaiTaiKhoan.Text = selectedRow.Cells["LoaiTaiKhoan"].Value.ToString();

                txtTenTaiKhoan.Enabled = false;
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một tài khoản để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvTaiKhoan.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa tài khoản này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string tenTaiKhoan = dgvTaiKhoan.SelectedRows[0].Cells["TenTaiKhoan"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string query = "DELETE FROM TaiKhoan WHERE TenTaiKhoan = @TenTaiKhoan";

                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                command.Parameters.AddWithValue("@TenTaiKhoan", tenTaiKhoan);

                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa tài khoản thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa tài khoản thất bại!");
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
                MessageBox.Show("Vui lòng chọn một tài khoản để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtTenTaiKhoan.Enabled = isEnabled;
            txtMaKhachHang.Enabled = isEnabled;
            txtMaNhanVien.Enabled = isEnabled;
            txtMatKhau.Enabled = isEnabled;
            txtLoaiTaiKhoan.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtTenTaiKhoan.Text = "";
                txtMaKhachHang.Text = "";
                txtMaNhanVien.Text = "";
                txtMatKhau.Text = "";
                txtLoaiTaiKhoan.Text = "";
            }
        }

        private void dgvTaiKhoan_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvTaiKhoan.Rows.Count)
            {
                DataGridViewRow row = dgvTaiKhoan.Rows[e.RowIndex];
                txtTenTaiKhoan.Text = row.Cells["TenTaiKhoan"].Value?.ToString();
                txtMaKhachHang.Text = row.Cells["MaKhachHang"].Value?.ToString();
                txtMaNhanVien.Text = row.Cells["MaNhanVien"].Value?.ToString();
                txtMatKhau.Text = row.Cells["MatKhau"].Value?.ToString();
                txtLoaiTaiKhoan.Text = row.Cells["LoaiTaiKhoan"].Value?.ToString();
            }
        }
    }
}