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
using System.Globalization;

namespace CuaHangDienThoai
{
    public partial class frmLapHoaDon : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        private string selectedMaSanPham;
        private decimal selectedGiaBan;
        public frmLapHoaDon()
        {
            InitializeComponent();
        }

        private void frmLapHoaDon_Load(object sender, EventArgs e)
        {
            LoadDataSanPham();
            LoadDataKhachHang();
            LoadDataNhanVien();
            LoadDataPhuongThucThanhToan();
            dgvChiTietHoaDon.Columns["DonGia"].DefaultCellStyle.Format = "N0";
            dgvChiTietHoaDon.Columns["ThanhTien"].DefaultCellStyle.Format = "N0";
            dgvSanPham.Columns["GiaBan"].DefaultCellStyle.Format = "N0";
            txtTongTien.Text = "0";
            txtMaHoaDon.Text = GenerateNewMaHoaDon();
            LoadDataHoaDon();
            

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
                                    row["GiaBan"],
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

        private void LoadDataKhachHang()
        {      
            // Load danh sách khách hàng
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaKhachHang, TenKhachHang FROM KhachHang";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            cboKhachHang.DataSource = dataTable;
                            cboKhachHang.DisplayMember = "TenKhachHang";
                            cboKhachHang.ValueMember = "MaKhachHang";
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

        private void LoadDataPhuongThucThanhToan()
        {
            // Load danh sách phương thức thanh toán
            cboPhuongThucThanhToan.Items.Add("Tiền mặt");
            cboPhuongThucThanhToan.Items.Add("Chuyển khoản");
            cboPhuongThucThanhToan.Items.Add("Thẻ tín dụng");
            cboPhuongThucThanhToan.SelectedIndex = 0; // Mặc định chọn tiền mặt
        }
        private string GenerateNewMaHoaDon()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    // Lấy năm hiện tại
                    string currentYear = DateTime.Now.Year.ToString();

                    // Tìm mã hóa đơn lớn nhất trong năm hiện tại
                    string query = "SELECT TOP 1 MaHoaDon FROM HoaDon WHERE MaHoaDon LIKE 'HD' + @CurrentYear + '%' ORDER BY MaHoaDon DESC";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@CurrentYear", currentYear);
                        string lastMaHoaDon = command.ExecuteScalar() as string;

                        // Tạo mã hóa đơn mới
                        if (!string.IsNullOrEmpty(lastMaHoaDon))
                        {
                            // Lấy phần số của mã hóa đơn cuối cùng
                            int lastNumber = int.Parse(lastMaHoaDon.Substring(6)); // HDyyyyxxxx, bỏ đi 6 ký tự đầu

                            // Tăng số lên 1 và format lại chuỗi
                            int nextNumber = lastNumber + 1;
                            string newMaHoaDon = "HD" + currentYear + nextNumber.ToString("D4"); // D4: format số thành 4 chữ số

                            return newMaHoaDon;
                        }
                        else
                        {
                            // Nếu không có hóa đơn nào trong năm hiện tại, bắt đầu từ HDyyyy0001
                            return "HD" + currentYear + "0001";
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
           
        }

        private void btnXoaSP_Click(object sender, EventArgs e)
        {
             if (dgvChiTietHoaDon.SelectedRows.Count > 0)
            {
                dgvChiTietHoaDon.Rows.Remove(dgvChiTietHoaDon.SelectedRows[0]);
                CapNhatTongTien();
            }
            else
            {
                MessageBox.Show("Vui lòng chọn sản phẩm cần xóa khỏi hóa đơn.");
            }
        }

        private void btnTaoHoaDon_Click(object sender, EventArgs e)
        {
            if (dgvChiTietHoaDon.Rows.Count == 0)
            {
                MessageBox.Show("Vui lòng thêm sản phẩm vào hóa đơn.");
                return;
            }
             if (string.IsNullOrEmpty(txtMaHoaDon.Text))
            {
                MessageBox.Show("Vui lòng nhập mã hóa đơn.");
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
                        // Thêm hóa đơn
                        string queryHoaDon = "INSERT INTO HoaDon (MaHoaDon, MaKhachHang, MaNhanVien, NgayLap, TongTien, PhuongThucThanhToan, TrangThaiDonHang) VALUES (@MaHoaDon, @MaKhachHang, @MaNhanVien, @NgayLap, @TongTien, @PhuongThucThanhToan, N'Chưa duyệt')";
                        using (SqlCommand commandHoaDon = new SqlCommand(queryHoaDon, connection, transaction))
                        {
                            commandHoaDon.Parameters.AddWithValue("@MaHoaDon", txtMaHoaDon.Text);
                            commandHoaDon.Parameters.AddWithValue("@MaKhachHang", cboKhachHang.SelectedValue);
                            commandHoaDon.Parameters.AddWithValue("@MaNhanVien", cboNhanVien.SelectedValue);
                            commandHoaDon.Parameters.AddWithValue("@NgayLap", dtpNgayLap.Value);
                            
                            if (float.TryParse(txtTongTien.Text.Replace(",", "").Replace(".", ""), NumberStyles.Any, CultureInfo.InvariantCulture, out float tongTien))
                            {
                                commandHoaDon.Parameters.AddWithValue("@TongTien", tongTien);
                            }
                            else
                            {
                                MessageBox.Show("Giá trị tổng tiền không hợp lệ.");
                                transaction.Rollback();
                                return;
                            }
                            commandHoaDon.Parameters.AddWithValue("@PhuongThucThanhToan", cboPhuongThucThanhToan.SelectedItem.ToString());

                            commandHoaDon.ExecuteNonQuery();
                        }

                        // Thêm chi tiết hóa đơn
                        foreach (DataGridViewRow row in dgvChiTietHoaDon.Rows)
                        {
                            string queryChiTiet = "INSERT INTO ChiTietHoaDon (MaHoaDon, MaSanPham, SoLuong, DonGia, ThanhTien) VALUES (@MaHoaDon, @MaSanPham, @SoLuong, @DonGia, @ThanhTien)";
                            using (SqlCommand commandChiTiet = new SqlCommand(queryChiTiet, connection, transaction))
                            {
                                commandChiTiet.Parameters.AddWithValue("@MaHoaDon", txtMaHoaDon.Text);
                                commandChiTiet.Parameters.AddWithValue("@MaSanPham", row.Cells["MaSP"].Value);
                                // Chuyển SoLuong sang int
                                if (int.TryParse(row.Cells["SoLuong"].Value.ToString(), out int soLuong))
                                {
                                    commandChiTiet.Parameters.AddWithValue("@SoLuong", soLuong);
                                }
                                else
                                {
                                    MessageBox.Show("Số lượng không hợp lệ ở dòng " + (row.Index + 1));
                                    transaction.Rollback();
                                    return;
                                }
                                
                                // Chuyển DonGia sang float, xử lý dấu phân cách thập phân
                                 if (float.TryParse(row.Cells["DonGia"].Value.ToString().Replace(",", "").Replace(".", ""), NumberStyles.Any, CultureInfo.InvariantCulture, out float donGia))
                                 {
                                     commandChiTiet.Parameters.AddWithValue("@DonGia", donGia);
                                 }
                                 else
                                 {
                                     MessageBox.Show("Đơn giá không hợp lệ ở dòng " + (row.Index + 1));
                                     transaction.Rollback();
                                     return;
                                 }

                                 // Chuyển ThanhTien sang float, xử lý dấu phân cách thập phân
                                 if (float.TryParse(row.Cells["ThanhTien"].Value.ToString().Replace(",", "").Replace(".", ""), NumberStyles.Any, CultureInfo.InvariantCulture, out float thanhTien))
                                 {
                                     commandChiTiet.Parameters.AddWithValue("@ThanhTien", thanhTien);
                                 }
                                 else
                                 {
                                     MessageBox.Show("Thành tiền không hợp lệ ở dòng " + (row.Index + 1));
                                     transaction.Rollback();
                                     return;
                                 }

                                commandChiTiet.ExecuteNonQuery();
                            }

                            // Cập nhật số lượng tồn kho
                            string queryCapNhatTonKho = "UPDATE SanPham SET SoLuongTonKho = SoLuongTonKho - @SoLuong WHERE MaSanPham = @MaSanPham";
                            using (SqlCommand commandCapNhatTonKho = new SqlCommand(queryCapNhatTonKho, connection, transaction))
                            {
                                // Chuyển SoLuong sang int
                                 if (int.TryParse(row.Cells["SoLuong"].Value.ToString(), out int soLuong))
                                 {
                                     commandCapNhatTonKho.Parameters.AddWithValue("@SoLuong", soLuong);
                                 }
                                 else
                                 {
                                     MessageBox.Show("Số lượng không hợp lệ ở dòng " + (row.Index + 1));
                                     transaction.Rollback();
                                     return;
                                 }
                                commandCapNhatTonKho.Parameters.AddWithValue("@MaSanPham", row.Cells["MaSP"].Value);

                                commandCapNhatTonKho.ExecuteNonQuery();
                            }
                        }

                        transaction.Commit();
                        MessageBox.Show("Tạo hóa đơn thành công!");
                        dgvChiTietHoaDon.Rows.Clear();
                        txtTongTien.Text = "0";
                        LoadDataSanPham();
                        txtMaHoaDon.Text = GenerateNewMaHoaDon();
                        LoadDataHoaDon();
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
            foreach (DataGridViewRow row in dgvChiTietHoaDon.Rows)
            {
                if (float.TryParse(row.Cells["ThanhTien"].Value.ToString().Replace(",", "").Replace(".", ""), NumberStyles.Any, CultureInfo.InvariantCulture, out float thanhTien))
                {
                    tongTien += thanhTien;
                }
            }
            txtTongTien.Text = tongTien.ToString("N0"); // Format lại hiển thị
        }

        private void dgvSanPham_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0 && e.RowIndex < dgvSanPham.Rows.Count)
            {
                DataGridViewRow row = dgvSanPham.Rows[e.RowIndex];
                selectedMaSanPham = row.Cells["MaSanPham"].Value?.ToString();
                selectedGiaBan = decimal.Parse(row.Cells["GiaBan"].Value.ToString());
            }
        }

        private void btnThemVaoHD_Click(object sender, EventArgs e)
        {
             if (string.IsNullOrEmpty(selectedMaSanPham))
            {
                MessageBox.Show("Vui lòng chọn sản phẩm.");
                return;
            }

            if (!int.TryParse(txtSoLuongMua.Text, out int soLuongMua) || soLuongMua <= 0)
            {
                MessageBox.Show("Vui lòng nhập số lượng mua hợp lệ.");
                return;
            }
            // Kiểm tra số lượng tồn kho
            int soLuongTonKho = 0;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT SoLuongTonKho FROM SanPham WHERE MaSanPham = @MaSanPham";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@MaSanPham", selectedMaSanPham);
                        soLuongTonKho = (int)command.ExecuteScalar();
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                    return;
                }
            }

            if (soLuongMua > soLuongTonKho)
            {
                MessageBox.Show("Số lượng mua vượt quá số lượng tồn kho.");
                return;
            }

            // Kiểm tra sản phẩm đã tồn tại trong chi tiết hóa đơn chưa
            bool daTonTai = false;
            foreach (DataGridViewRow row in dgvChiTietHoaDon.Rows)
            {
                if (row.Cells["MaSP"].Value.ToString() == selectedMaSanPham)
                {
                    int soLuongHienTai = int.Parse(row.Cells["SoLuong"].Value.ToString());
                    int soLuongMoi = soLuongHienTai + soLuongMua;
                    
                    if (soLuongMoi > soLuongTonKho)
                    {
                        MessageBox.Show("Số lượng mua vượt quá số lượng tồn kho.");
                        return;
                    }

                    row.Cells["SoLuong"].Value = soLuongMoi;
                    row.Cells["ThanhTien"].Value = (soLuongMoi * selectedGiaBan).ToString("N0");
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
                dgvChiTietHoaDon.Rows.Add(selectedMaSanPham, tenSanPham, soLuongMua, selectedGiaBan.ToString("N0"), (soLuongMua * selectedGiaBan).ToString("N0"));
            }

            CapNhatTongTien();
        }
        private void LoadDataHoaDon()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = @"SELECT hd.MaHoaDon, hd.NgayLap, kh.TenKhachHang, nv.TenNhanVien, hd.TongTien, hd.PhuongThucThanhToan, hd.TrangThaiDonHang
                            FROM HoaDon hd
                            INNER JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
                            INNER JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);
                            dgvHoaDon.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvHoaDon.Rows.Add(
                                    row["MaHoaDon"],
                                    Convert.ToDateTime(row["NgayLap"]).ToString("dd/MM/yyyy"),
                                    row["TenKhachHang"],
                                    row["TenNhanVien"],
                                    float.Parse(row["TongTien"].ToString()).ToString("N0"),
                                    row["PhuongThucThanhToan"],
                                    row["TrangThaiDonHang"]
                                );
                            }
                            // Chuyển phần format cột xuống đây
                            dgvHoaDon.Columns["TongTien1"].DefaultCellStyle.Format = "N0";
                            dgvHoaDon.Columns["NgayLap1"].DefaultCellStyle.Format = "dd/MM/yyyy";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }
    }
}