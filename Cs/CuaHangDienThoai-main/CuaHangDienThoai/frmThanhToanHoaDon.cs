using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace CuaHangDienThoai
{
    public partial class frmThanhToanHoaDon : Form
    {
        private string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        
        public frmThanhToanHoaDon()
        {
            InitializeComponent();
            this.Load += new EventHandler(frmThanhToanHoaDon_Load);
            
            // Thiết lập các thuộc tính cho DataGridView
            dgvHoaDon.AutoGenerateColumns = false;
            dgvHoaDon.AllowUserToAddRows = false;
            dgvHoaDon.AllowUserToDeleteRows = false;
            dgvHoaDon.ReadOnly = true;
            dgvHoaDon.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
            dgvHoaDon.MultiSelect = false;

            // Thêm và cấu hình các cột với chiều rộng tùy chỉnh
            dgvHoaDon.Columns.Clear();
            dgvHoaDon.Columns.AddRange(
                new DataGridViewTextBoxColumn { Name = "MaHoaDon", DataPropertyName = "MaHoaDon", HeaderText = "Mã HĐ", Width = 120 },
                new DataGridViewTextBoxColumn { Name = "NgayLap", DataPropertyName = "NgayLap", HeaderText = "Ngày lập", Width = 150 },
                new DataGridViewTextBoxColumn { Name = "TenKhachHang", DataPropertyName = "TenKhachHang", HeaderText = "Khách hàng", Width = 200 },
                new DataGridViewTextBoxColumn { Name = "TenNhanVien", DataPropertyName = "TenNhanVien", HeaderText = "Nhân viên", Width = 200 },
                new DataGridViewTextBoxColumn { Name = "TongTien", DataPropertyName = "TongTien", HeaderText = "Tổng tiền", Width = 150 },
                new DataGridViewTextBoxColumn { Name = "PhuongThucThanhToan", DataPropertyName = "PhuongThucThanhToan", HeaderText = "Phương thức TT", Width = 180 },
                new DataGridViewTextBoxColumn { Name = "TrangThaiDonHang", DataPropertyName = "TrangThaiDonHang", HeaderText = "Trạng thái", Width = 150 }
            );

            // Điều chỉnh chiều cao của hàng
            dgvHoaDon.RowTemplate.Height = 40; // Có thể điều chỉnh số 40 theo ý muốn
            dgvHoaDon.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.None;

            // Tùy chọn: Điều chỉnh font chữ cho header và nội dung
            dgvHoaDon.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
            dgvHoaDon.DefaultCellStyle.Font = new Font("Segoe UI", 11F, FontStyle.Regular);

            // Điều chỉnh chiều cao của header
            dgvHoaDon.ColumnHeadersHeight = 50; // Có thể điều chỉnh số 50 theo ý muốn
            dgvHoaDon.EnableHeadersVisualStyles = false; // Cho phép tùy chỉnh style của header
        }

        private void frmThanhToanHoaDon_Load(object sender, EventArgs e)
        {
            LoadDataHoaDonChuaThanhToan();
            LoadPhuongThucThanhToan();
        }

        private void LoadDataHoaDonChuaThanhToan()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = connection;
                    
                    string query = @"SELECT hd.MaHoaDon, hd.NgayLap, 
                                   kh.TenKhachHang, nv.TenNhanVien,
                                   hd.TongTien, hd.PhuongThucThanhToan, 
                                   hd.TrangThaiDonHang 
                                   FROM HoaDon hd
                                   INNER JOIN KhachHang kh ON hd.MaKhachHang = kh.MaKhachHang
                                   INNER JOIN NhanVien nv ON hd.MaNhanVien = nv.MaNhanVien
                                   WHERE hd.TrangThaiDonHang = 'Chua duyet'";
                    
                    cmd.CommandText = query;
                    cmd.CommandType = CommandType.Text;

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    da.Fill(dt);

                    if (dt.Rows.Count > 0)
                    {
                        dgvHoaDon.DataSource = dt;
                    }
                    else
                    {
                        MessageBox.Show("Không có hóa đơn nào chưa thanh toán!");
                        
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
                finally
                {
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }
        }

        private void LoadPhuongThucThanhToan()
        {
            cboPhuongThuc.Items.Clear();
            cboPhuongThuc.Items.Add("Tiền mặt");
            cboPhuongThuc.Items.Add("Chuyển khoản");
            cboPhuongThuc.Items.Add("Thẻ tín dụng");
            cboPhuongThuc.SelectedIndex = 0;
        }

        private void dgvHoaDon_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                DataGridViewRow row = dgvHoaDon.Rows[e.RowIndex];
                txtMaHoaDon.Text = row.Cells["MaHoaDon"].Value?.ToString();
                txtTongTien.Text = row.Cells["TongTien"].Value?.ToString();
                
                string phuongThuc = row.Cells["PhuongThucThanhToan"].Value?.ToString();
                if (!string.IsNullOrEmpty(phuongThuc))
                {
                    cboPhuongThuc.Text = phuongThuc;
                }
                else
                {
                    cboPhuongThuc.SelectedIndex = 0;
                }
            }
        }

        private void btnThanhToan_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtMaHoaDon.Text))
            {
                MessageBox.Show("Vui lòng chọn hóa đơn cần thanh toán!");
                return;
            }

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = connection;
                    
                    string query = @"UPDATE HoaDon 
                                   SET TrangThaiDonHang = N'Đã thanh toán',
                                       PhuongThucThanhToan = @PhuongThucThanhToan
                                   WHERE MaHoaDon = @MaHoaDon";

                    cmd.CommandText = query;
                    cmd.CommandType = CommandType.Text;
                    
                    cmd.Parameters.AddWithValue("@MaHoaDon", txtMaHoaDon.Text);
                    cmd.Parameters.AddWithValue("@PhuongThucThanhToan", cboPhuongThuc.Text);

                    int result = cmd.ExecuteNonQuery();
                    if (result > 0)
                    {
                        MessageBox.Show("Thanh toán hóa đơn thành công!");
                        LoadDataHoaDonChuaThanhToan();
                        txtMaHoaDon.Clear();
                        txtTongTien.Clear();
                        cboPhuongThuc.SelectedIndex = 0;
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
                finally
                {
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }
        }
    }
}
