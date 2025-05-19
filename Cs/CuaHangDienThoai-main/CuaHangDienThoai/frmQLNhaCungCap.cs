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
    public partial class frmQLNhaCungCap : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        bool isAdding = false;

        public frmQLNhaCungCap()
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
                    string query = "SELECT * FROM NhaCungCap";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            dgvNhaCungCap.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvNhaCungCap.Rows.Add(
                                    row["MaNhaCungCap"],
                                    row["TenNhaCungCap"],
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
            dgvNhaCungCap.Enabled = false;
            btnSua.Enabled = false;
            btnXoa.Enabled = false;
            isAdding = true;
        }

        private void btnLuu_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaNCC.Text))
            {
                MessageBox.Show("Vui lòng nhập mã nhà cung cấp.");
                return;
            }

            if (isAdding)
            {
                try
                {
                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        connection.Open();

                        string query = "INSERT INTO NhaCungCap (MaNhaCungCap, TenNhaCungCap, DiaChi, SoDienThoai, Email) VALUES (@MaNhaCungCap, @TenNhaCungCap, @DiaChi, @SoDienThoai, @Email)";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaNhaCungCap", txtMaNCC.Text);
                            command.Parameters.AddWithValue("@TenNhaCungCap", txtTenNCC.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Thêm nhà cung cấp thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvNhaCungCap.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Thêm nhà cung cấp thất bại!");
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

                        string query = "UPDATE NhaCungCap SET TenNhaCungCap = @TenNhaCungCap, DiaChi = @DiaChi, SoDienThoai = @SoDienThoai, Email = @Email WHERE MaNhaCungCap = @MaNhaCungCap";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaNhaCungCap", txtMaNCC.Text);
                            command.Parameters.AddWithValue("@TenNhaCungCap", txtTenNCC.Text);
                            command.Parameters.AddWithValue("@DiaChi", txtDiaChi.Text);
                            command.Parameters.AddWithValue("@SoDienThoai", txtSoDienThoai.Text);
                            command.Parameters.AddWithValue("@Email", txtEmail.Text);

                            int rowsAffected = command.ExecuteNonQuery();

                            if (rowsAffected > 0)
                            {
                                MessageBox.Show("Cập nhật nhà cung cấp thành công!");
                                LoadData();
                                AnHienTextBox(false);
                                dgvNhaCungCap.Enabled = true;
                                btnSua.Enabled = true;
                                btnXoa.Enabled = true;
                                btnThem.Enabled = true;
                                isAdding = false;
                            }
                            else
                            {
                                MessageBox.Show("Cập nhật nhà cung cấp thất bại!");
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
            dgvNhaCungCap.Enabled = true;
            btnSua.Enabled = true;
            btnXoa.Enabled = true;
            isAdding = false;
        }

        private void btnSua_Click(object sender, EventArgs e)
        {
            if (dgvNhaCungCap.SelectedRows.Count > 0)
            {
                AnHienTextBox(true);
                dgvNhaCungCap.Enabled = false;
                btnThem.Enabled = false;
                btnXoa.Enabled = false;
                isAdding = false;

                DataGridViewRow selectedRow = dgvNhaCungCap.SelectedRows[0];
                txtMaNCC.Text = selectedRow.Cells["MaNhaCungCap"].Value.ToString();
                txtTenNCC.Text = selectedRow.Cells["TenNhaCungCap"].Value.ToString();
                txtDiaChi.Text = selectedRow.Cells["DiaChi"].Value.ToString();
                txtSoDienThoai.Text = selectedRow.Cells["SoDienThoai"].Value.ToString();
                txtEmail.Text = selectedRow.Cells["Email"].Value.ToString();

                txtMaNCC.Enabled = false;
            }
            else
            {
                MessageBox.Show("Vui lòng chọn một nhà cung cấp để sửa!");
            }
        }

        private void btnXoa_Click(object sender, EventArgs e)
        {
            if (dgvNhaCungCap.SelectedRows.Count > 0)
            {
                if (MessageBox.Show("Bạn có chắc chắn muốn xóa nhà cung cấp này?", "Xác nhận xóa", MessageBoxButtons.YesNo) == DialogResult.Yes)
                {
                    string maNCC = dgvNhaCungCap.SelectedRows[0].Cells["MaNhaCungCap"].Value.ToString();

                    try
                    {
                        using (SqlConnection connection = new SqlConnection(connectionString))
                        {
                            connection.Open();

                            string query = "DELETE FROM NhaCungCap WHERE MaNhaCungCap = @MaNhaCungCap";

                            using (SqlCommand command = new SqlCommand(query, connection))
                            {
                                command.Parameters.AddWithValue("@MaNhaCungCap", maNCC);

                                int rowsAffected = command.ExecuteNonQuery();

                                if (rowsAffected > 0)
                                {
                                    MessageBox.Show("Xóa nhà cung cấp thành công!");
                                    LoadData();
                                }
                                else
                                {
                                    MessageBox.Show("Xóa nhà cung cấp thất bại!");
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
                MessageBox.Show("Vui lòng chọn một nhà cung cấp để xóa!");
            }
        }

        private void AnHienTextBox(bool isEnabled)
        {
            txtMaNCC.Enabled = isEnabled;
            txtTenNCC.Enabled = isEnabled;
            txtDiaChi.Enabled = isEnabled;
            txtSoDienThoai.Enabled = isEnabled;
            txtEmail.Enabled = isEnabled;
            btnLuu.Enabled = isEnabled;
            btnHuy.Enabled = isEnabled;

            if (!isEnabled)
            {
                txtMaNCC.Text = "";
                txtTenNCC.Text = "";
                txtDiaChi.Text = "";
                txtSoDienThoai.Text = "";
                txtEmail.Text = "";
            }
        }

        private void dgvNhaCungCap_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvNhaCungCap.Rows.Count)
            {
                DataGridViewRow row = dgvNhaCungCap.Rows[e.RowIndex];
                txtMaNCC.Text = row.Cells["MaNhaCungCap"].Value?.ToString();
                txtTenNCC.Text = row.Cells["TenNhaCungCap"].Value?.ToString();
                txtDiaChi.Text = row.Cells["DiaChi"].Value?.ToString();
                txtSoDienThoai.Text = row.Cells["SoDienThoai"].Value?.ToString();
                txtEmail.Text = row.Cells["Email"].Value?.ToString();
            }
        }
    }
}