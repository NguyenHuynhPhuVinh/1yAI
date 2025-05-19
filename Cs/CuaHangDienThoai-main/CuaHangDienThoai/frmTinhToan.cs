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
    public partial class frmTinhToan : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";
        DataTable dtSanPham; // DataTable để lưu thông tin sản phẩm

        public frmTinhToan()
        {
            InitializeComponent();
        }

        private void frmTinhToan_Load(object sender, EventArgs e)
        {
            // Hiển thị hướng dẫn sử dụng cho chức năng tính toán
            txtHuongDan.Text = GetHuongDanTinhToan();
            txtHuongDan.ReadOnly = true; // Không cho phép chỉnh sửa
            txtHuongDan.Multiline = true;
            txtHuongDan.ScrollBars = ScrollBars.Vertical;
            txtHuongDan.Dock = DockStyle.Bottom;

            // Tạo DataTable 
            dtSanPham = new DataTable();
            dtSanPham.Columns.Add("MaSanPham", typeof(string));
            dtSanPham.Columns.Add("TenSanPham", typeof(string));
            dtSanPham.Columns.Add("GiaBan", typeof(double));
            dtSanPham.Columns.Add("SoLuong", typeof(int));
            dtSanPham.Columns.Add("ThanhTien", typeof(double), "GiaBan * SoLuong"); // Biểu thức tính thành tiền

            // Load danh sách sản phẩm vào DataTable
            LoadSanPhamToDataGridView();

            // Gán DataSource cho DataGridView sau khi đã load dữ liệu
            dgvSanPham.DataSource = dtSanPham;

            // Không cần thêm cột "SoLuong" ở đây nữa vì đã có trong Designer
             // In ra chỉ số của các cột để xác định index của cột "SoLuong"
            for (int i = 0; i < dgvSanPham.Columns.Count; i++)
            {
                Console.WriteLine($"Column Name: {dgvSanPham.Columns[i].Name}, Index: {i}");
            }
        }

        private string GetHuongDanTinhToan()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("HƯỚNG DẪN SỬ DỤNG CHỨC NĂNG TÍNH TOÁN");
            sb.AppendLine("");

            sb.AppendLine("I. Tính giá bán sản phẩm:");
            sb.AppendLine("- Chọn sản phẩm cần tính giá từ danh sách sản phẩm.");
            sb.AppendLine("- Nhập tỷ lệ lợi nhuận mong muốn (%).");
            sb.AppendLine("- Nhấn nút \"Tính giá bán\".");
            sb.AppendLine("- Kết quả giá bán sẽ được hiển thị.");
            sb.AppendLine("");

            sb.AppendLine("II. Tính tổng tiền đơn hàng:");
            sb.AppendLine("- Thêm sản phẩm vào giỏ hàng bằng cách chọn sản phẩm trong danh sách.");
            sb.AppendLine("- Nhập số lượng cho mỗi sản phẩm trong cột \"Số Lượng\".");
            sb.AppendLine("- Nhấn nút \"Tính tổng tiền\".");
            sb.AppendLine("- Kết quả tổng tiền đơn hàng sẽ được hiển thị.");
            sb.AppendLine("");

            sb.AppendLine("III. Tính chiết khấu:");
            sb.AppendLine("- Nhập số tiền gốc.");
            sb.AppendLine("- Nhập tỷ lệ chiết khấu (%).");
            sb.AppendLine("- Nhấn nút \"Tính chiết khấu\".");
            sb.AppendLine("- Kết quả số tiền sau khi chiết khấu sẽ được hiển thị.");
            sb.AppendLine("");

            sb.AppendLine("IV. Tính lợi nhuận:");
            sb.AppendLine("- Nhập doanh thu.");
            sb.AppendLine("- Nhập chi phí.");
            sb.AppendLine("- Nhấn nút \"Tính lợi nhuận\".");
            sb.AppendLine("- Kết quả lợi nhuận sẽ được hiển thị.");
            sb.AppendLine("");

            sb.AppendLine("Lưu ý:");
            sb.AppendLine("- Đảm bảo nhập đúng định dạng số cho các trường yêu cầu.");
            sb.AppendLine("- Kiểm tra kỹ thông tin trước khi thực hiện tính toán.");

            return sb.ToString();
        }

        private void LoadSanPhamToDataGridView()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaSanPham, TenSanPham, GiaBan FROM SanPham";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            foreach (DataRow row in dataTable.Rows)
                            {
                                // Thêm sản phẩm vào DataTable dtSanPham
                                dtSanPham.Rows.Add(row["MaSanPham"], row["TenSanPham"], row["GiaBan"], 0, 0);
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

        private void btnTinhTong_Click(object sender, EventArgs e)
        {
            // Xử lý sự kiện khi nhấn nút "Tính Tổng Tiền"
            try
            {
                double tongTien = 0;
                foreach (DataRow row in dtSanPham.Rows)
                {
                    if (row["SoLuong"] != DBNull.Value && !string.IsNullOrEmpty(row["SoLuong"].ToString()))
                    {
                        tongTien += Convert.ToDouble(row["ThanhTien"]);
                    }
                }

                // Hiển thị kết quả
                lblKetQua.Text = "Tổng tiền: " + tongTien.ToString("N0");
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lỗi: " + ex.Message);
            }
        }

        private void dgvSanPham_CellValueChanged(object sender, DataGridViewCellEventArgs e)
        {
            // Cập nhật thành tiền khi số lượng thay đổi
            // Giả sử cột "SoLuong" có index là 3, cần kiểm tra lại index thực tế
            if (e.ColumnIndex == 3 && e.RowIndex >= 0)
            {
                dgvSanPham.RefreshEdit(); // Cập nhật giá trị hiển thị ngay lập tức
            }
        }

        private void dgvSanPham_EditingControlShowing(object sender, DataGridViewEditingControlShowingEventArgs e)
        {
            // Giới hạn chỉ cho nhập số vào cột "Số Lượng"
            e.Control.KeyPress -= new KeyPressEventHandler(Column_KeyPress);
            // Giả sử cột "SoLuong" có index là 3, cần kiểm tra lại index thực tế
            if (dgvSanPham.CurrentCell.ColumnIndex == 3)
            {
                TextBox tb = e.Control as TextBox;
                if (tb != null)
                {
                    tb.KeyPress += new KeyPressEventHandler(Column_KeyPress);
                }
            }
        }

        private void Column_KeyPress(object sender, KeyPressEventArgs e)
        {
            // Chỉ cho phép nhập số và phím điều khiển
            if (!char.IsControl(e.KeyChar) && !char.IsDigit(e.KeyChar))
            {
                e.Handled = true;
            }
        }
    }
}