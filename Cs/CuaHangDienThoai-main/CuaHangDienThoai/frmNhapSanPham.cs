using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace CuaHangDienThoai
{
    public partial class frmNhapSanPham : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        private string selectedMaSanPham;
        private float selectedGiaNhap;
        public frmNhapSanPham()
        {
            InitializeComponent();
        }

        private void frmNhapSanPham_Load(object sender, EventArgs e)
        {
            LoadDataSanPham();
            LoadDataNhanVien();
            LoadDataNhaCungCap();
            dgvChiTietPhieuNhap.Columns["DonGia"].DefaultCellStyle.Format = "N0";
            dgvChiTietPhieuNhap.Columns["ThanhTien"].DefaultCellStyle.Format = "N0";
            dgvPhieuNhap.Columns["TongTien"].DefaultCellStyle.Format = "N0";
            dgvSanPham.Columns["GiaBan"].DefaultCellStyle.Format = "N0";
            txtTongTien.Text = "0";
            txtMaPhieuNhap.Text = GenerateNewMaPhieuNhap();
            LoadDataPhieuNhap();
        }

        private void LoadDataSanPham()
        {
            // Load danh sách sản phẩm
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaSanPham, TenSanPham, GiaBan, SoLuongTonKho FROM SanPham";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dgvSanPham.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvSanPham.Rows.Add(
                                    row["MaSanPham"],
                                    row["TenSanPham"],
                                    float.Parse(row["GiaBan"].ToString()).ToString("N0"),
                                    row["SoLuongTonKho"]
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

        private void LoadDataNhanVien()
        {
            // Load danh sách nhân viên
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaNhanVien, TenNhanVien FROM NhanVien";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            cboNhanVien.DataSource = dataTable;
                            cboNhanVien.DisplayMember = "TenNhanVien";
                            cboNhanVien.ValueMember = "MaNhanVien";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }

        private void LoadDataNhaCungCap()
        {
            // Load danh sách nhà cung cấp
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaNhaCungCap, TenNhaCungCap FROM NhaCungCap";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            cboNhaCungCap.DataSource = dataTable;
                            cboNhaCungCap.DisplayMember = "TenNhaCungCap";
                            cboNhaCungCap.ValueMember = "MaNhaCungCap";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }

        private string GenerateNewMaPhieuNhap()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    // Lấy năm hiện tại
                    string currentYear = DateTime.Now.Year.ToString();

                    // Tìm mã phiếu nhập lớn nhất trong năm hiện tại
                    string query = "SELECT TOP 1 MaPhieuNhap FROM PhieuNhap WHERE MaPhieuNhap LIKE 'PN' + @CurrentYear + '%' ORDER BY MaPhieuNhap DESC";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CurrentYear", currentYear);
                        string lastMaPhieuNhap = command.ExecuteScalar() as string;

                        // Tạo mã phiếu nhập mới
                        if (!string.IsNullOrEmpty(lastMaPhieuNhap))
                        {
                            // Lấy phần số của mã phiếu nhập cuối cùng
                            int lastNumber = int.Parse(lastMaPhieuNhap.Substring(6)); // PNyyyyxxxx, bỏ đi 6 ký tự đầu

                            // Tăng số lên 1 và format lại chuỗi
                            int nextNumber = lastNumber + 1;
                            string newMaPhieuNhap = "PN" + currentYear + nextNumber.ToString("D4"); // D4: format số thành 4 chữ số

                            return newMaPhieuNhap;
                        }
                        else
                        {
                            // Nếu không có phiếu nhập nào trong năm hiện tại, bắt đầu từ PNyyyy0001
                            return "PN" + currentYear + "0001";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                    return string.Empty;
                }
            }
        }

        private void btnThemSP_Click(object sender, EventArgs e)
        {
            // Code để mở form thêm sản phẩm (nếu cần)
        }

        private void btnXoaSP_Click(object sender, EventArgs e)
        {
            if (dgvChiTietPhieuNhap.SelectedRows.Count > 0)
            {
                dgvChiTietPhieuNhap.Rows.Remove(dgvChiTietPhieuNhap.SelectedRows[0]);
                CapNhatTongTien();
            }
            else
            {
                MessageBox.Show("Vui lòng chọn sản phẩm cần xóa khỏi phiếu nhập.");
            }
        }
        private void LoadDataPhieuNhap()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = @"SELECT pn.MaPhieuNhap, pn.NgayNhap, nv.TenNhanVien, ncc.TenNhaCungCap, pn.TongTien
                            FROM PhieuNhap pn
                            INNER JOIN NhanVien nv ON pn.MaNhanVien = nv.MaNhanVien
                            INNER JOIN NhaCungCap ncc ON pn.MaNhaCungCap = ncc.MaNhaCungCap";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dgvPhieuNhap.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvPhieuNhap.Rows.Add(
                                    row["MaPhieuNhap"],
                                    row["TenNhanVien"],
                                    row["TenNhaCungCap"],
                                    Convert.ToDateTime(row["NgayNhap"]).ToString("dd/MM/yyyy"),
                                    
                                    float.Parse(row["TongTien"].ToString()).ToString("N0")
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
        private void btnTaoPhieuNhap_Click(object sender, EventArgs e)
        {
            if (dgvChiTietPhieuNhap.Rows.Count == 0)
            {
                MessageBox.Show("Vui lòng thêm sản phẩm vào phiếu nhập.");
                return;
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    SqlTransaction transaction = connection.BeginTransaction();

                    try
                    {
                        // Thêm phiếu nhập
                        string queryPhieuNhap = "INSERT INTO PhieuNhap (MaPhieuNhap, MaNhanVien, MaNhaCungCap, NgayNhap, TongTien) VALUES (@MaPhieuNhap, @MaNhanVien, @MaNhaCungCap, @NgayNhap, @TongTien)";
                        using (SqlCommand commandPhieuNhap = new SqlCommand(queryPhieuNhap, connection, transaction))
                        {
                            commandPhieuNhap.Parameters.AddWithValue("@MaPhieuNhap", txtMaPhieuNhap.Text);
                            commandPhieuNhap.Parameters.AddWithValue("@MaNhanVien", cboNhanVien.SelectedValue);
                            commandPhieuNhap.Parameters.AddWithValue("@MaNhaCungCap", cboNhaCungCap.SelectedValue);
                            commandPhieuNhap.Parameters.AddWithValue("@NgayNhap", dtpNgayNhap.Value);
                            commandPhieuNhap.Parameters.AddWithValue("@TongTien", float.Parse(txtTongTien.Text, NumberStyles.AllowCurrencySymbol | NumberStyles.Number));

                            commandPhieuNhap.ExecuteNonQuery();
                        }

                        // Thêm chi tiết phiếu nhập
                        foreach (DataGridViewRow row in dgvChiTietPhieuNhap.Rows)
                        {
                            string queryChiTiet = "INSERT INTO ChiTietPhieuNhap (MaPhieuNhap, MaSanPham, SoLuong, DonGia) VALUES (@MaPhieuNhap, @MaSanPham, @SoLuong, @DonGia)";
                            using (SqlCommand commandChiTiet = new SqlCommand(queryChiTiet, connection, transaction))
                            {
                                commandChiTiet.Parameters.AddWithValue("@MaPhieuNhap", txtMaPhieuNhap.Text);
                                commandChiTiet.Parameters.AddWithValue("@MaSanPham", row.Cells["MaSP"].Value);
                                commandChiTiet.Parameters.AddWithValue("@SoLuong", int.Parse(row.Cells["SoLuong"].Value.ToString()));
                                commandChiTiet.Parameters.AddWithValue("@DonGia", float.Parse(row.Cells["DonGia"].Value.ToString(), NumberStyles.AllowCurrencySymbol | NumberStyles.Number));

                                commandChiTiet.ExecuteNonQuery();
                            }
                        }

                        transaction.Commit();
                        MessageBox.Show("Tạo phiếu nhập thành công!");
                        dgvChiTietPhieuNhap.Rows.Clear();
                        txtTongTien.Text = "0";
                        LoadDataSanPham();
                        txtMaPhieuNhap.Text = GenerateNewMaPhieuNhap();
                        LoadDataPhieuNhap();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        MessageBox.Show("Lỗi: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }

        private void CapNhatTongTien()
        {
            float tongTien = 0;
            foreach (DataGridViewRow row in dgvChiTietPhieuNhap.Rows)
            {
                tongTien += float.Parse(row.Cells["ThanhTien"].Value.ToString(), NumberStyles.AllowCurrencySymbol | NumberStyles.Number);
            }
            txtTongTien.Text = tongTien.ToString("N0");
        }

        private void dgvSanPham_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvSanPham.Rows.Count)
            {
                DataGridViewRow row = dgvSanPham.Rows[e.RowIndex];
                selectedMaSanPham = row.Cells["MaSanPham"].Value?.ToString();
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        connection.Open();
                        string query = "SELECT GiaNhap FROM CungCap WHERE MaSanPham = @MaSanPham";
                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaSanPham", selectedMaSanPham);
                            selectedGiaNhap = float.Parse(command.ExecuteScalar().ToString());
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Lỗi: " + ex.Message);
                        return;
                    }
                }
            }
        }

        private void btnThemVaoPhieuNhap_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(selectedMaSanPham))
            {
                MessageBox.Show("Vui lòng chọn sản phẩm.");
                return;
            }

            if (!int.TryParse(txtSoLuongNhap.Text, out int soLuongNhap) || soLuongNhap <= 0)
            {
                MessageBox.Show("Vui lòng nhập số lượng nhập hợp lệ.");
                return;
            }

            // Kiểm tra sản phẩm đã tồn tại trong chi tiết phiếu nhập chưa
            bool daTonTai = false;
            foreach (DataGridViewRow row in dgvChiTietPhieuNhap.Rows)
            {
                if (row.Cells["MaSP"].Value.ToString() == selectedMaSanPham)
                {
                    int soLuongHienTai = int.Parse(row.Cells["SoLuong"].Value.ToString());
                    row.Cells["SoLuong"].Value = soLuongHienTai + soLuongNhap;
                    row.Cells["ThanhTien"].Value = ((soLuongHienTai + soLuongNhap) * selectedGiaNhap).ToString("N0");
                    daTonTai = true;
                    break;
                }
            }

            if (!daTonTai)
            {
                string tenSanPham = "";
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    try
                    {
                        connection.Open();
                        string query = "SELECT TenSanPham FROM SanPham WHERE MaSanPham = @MaSanPham";
                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@MaSanPham", selectedMaSanPham);
                            tenSanPham = command.ExecuteScalar() as string;
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Lỗi: " + ex.Message);
                        return;
                    }
                }
                dgvChiTietPhieuNhap.Rows.Add(selectedMaSanPham, tenSanPham, soLuongNhap, selectedGiaNhap.ToString("N0"), (soLuongNhap * selectedGiaNhap).ToString("N0"));
            }

            CapNhatTongTien();
        }
    }
}