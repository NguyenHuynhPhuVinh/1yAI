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
    public partial class frmQuanTri : Form
    {
        // Chuỗi kết nối CSDL
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        // Biến lưu trạng thái admin hay user
        string role;
        // hoặc có thể dùng biến bool
        // bool isAdmin;

        // Constructor nhận tham số từ Form1
        public frmQuanTri(string role)
        {
            InitializeComponent();
            this.role = role; // Gán giá trị cho biến role
            // hoặc this.isAdmin = isAdmin;
            menuStrip1.Renderer = new CustomRenderer();
        }

        // Hàm ẩn hiện các chức năng tùy theo role
        private void PhanQuyen()
        {
            if (role == "admin") // Nếu là admin
            {
                quảnLýToolStripMenuItem.Visible = true;
                traCứuToolStripMenuItem.Visible = true;
                tinhToantoolStripMenuItem2.Visible = true;
                thongKetoolStripMenuItem1.Visible = true;
                baoBieutoolStripMenuItem3.Visible = true;
                nhanSanPhamtoolStripMenuItem2.Visible = true;
                lapHoaDontoolStripMenuItem1.Visible = true;
                ThanhToantoolStripMenuItem1.Visible = false;
            }
            else if (role == "user") // Nếu là user
            {
                // Nếu không phải admin thì có thể ẩn hết menu hoặc chỉ để lại 1 số menu tra cứu cơ bản
                quảnLýToolStripMenuItem.Visible = false;
                tinhToantoolStripMenuItem2.Visible = true;
                thongKetoolStripMenuItem1.Visible = false;
                baoBieutoolStripMenuItem3.Visible = false;
                nhanSanPhamtoolStripMenuItem2.Visible = false;
                lapHoaDontoolStripMenuItem1.Visible = false;
                traCứuToolStripMenuItem.Visible = true;
                traCứuSảnPhẩmToolStripMenuItem.Visible = true;
                ThanhToantoolStripMenuItem1.Visible = true;
            }
        }

        private void frmQuanTri_Load(object sender, EventArgs e)
        {
            PhanQuyen(); // Gọi hàm phân quyền khi form load
             // Hiển thị hướng dẫn sử dụng
            txtHuongDan.Text = GetHuongDanSuDung();
            txtHuongDan.ReadOnly = true; // Không cho phép chỉnh sửa
            txtHuongDan.Multiline = true;
            txtHuongDan.ScrollBars = ScrollBars.Vertical;
            txtHuongDan.Dock = DockStyle.Fill;
        }

        private void sảnPhẩmToolStripMenuItem_Click(object sender, EventArgs e)
        {

            frmQLSanPham frm = new frmQLSanPham();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        // Phương thức tạo nội dung hướng dẫn sử dụng
        private string GetHuongDanSuDung()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine("HƯỚNG DẪN SỬ DỤNG PHẦN MỀM QUẢN LÝ CỬA HÀNG ĐIỆN THOẠI");
            sb.AppendLine("");

            sb.AppendLine("I. Đăng nhập:");
            sb.AppendLine("- Nhập tên đăng nhập và mật khẩu vào các ô tương ứng.");
            sb.AppendLine("- Nhấn nút \"Đăng nhập\".");
            sb.AppendLine("");

            sb.AppendLine("II. Quản lý:");
            sb.AppendLine("    1. Sản phẩm:");
            sb.AppendLine("    - Thêm mới sản phẩm: Nhấn vào menu \"Quản lý\" -> \"Sản phẩm\", chọn \"Thêm mới\". Nhập đầy đủ thông tin sản phẩm và nhấn \"Lưu\".");
            sb.AppendLine("    - Sửa thông tin sản phẩm: Chọn sản phẩm cần sửa, thay đổi thông tin và nhấn \"Lưu\".");
            sb.AppendLine("    - Xóa sản phẩm: Chọn sản phẩm cần xóa và nhấn \"Xóa\".");
            sb.AppendLine("    - Tìm kiếm sản phẩm: Nhập từ khóa vào ô tìm kiếm và nhấn \"Tìm kiếm\".");
            sb.AppendLine("");

            sb.AppendLine("    2. Nhân viên:");
            sb.AppendLine("    - (Tương tự như quản lý sản phẩm, bạn có thể thêm hướng dẫn cho các chức năng thêm, sửa, xóa, tìm kiếm nhân viên)");
            sb.AppendLine("");

            sb.AppendLine("    3. Khách hàng:");
            sb.AppendLine("    - (Tương tự như quản lý sản phẩm)");
            sb.AppendLine("");

            sb.AppendLine("    4. Tài khoản:");
            sb.AppendLine("    - (Tương tự như quản lý sản phẩm)");
            sb.AppendLine("");

            sb.AppendLine("    5. Nhà cung cấp:");
            sb.AppendLine("    - (Tương tự như quản lý sản phẩm)");
            sb.AppendLine("");

            sb.AppendLine("III. Tra cứu:");
            sb.AppendLine("    - Nhấn vào menu \"Tra cứu\" và chọn loại thông tin cần tra cứu (Sản phẩm, Nhân viên, Khách hàng, Tài khoản).");
            sb.AppendLine("    - Nhập từ khóa tìm kiếm và nhấn \"Tìm kiếm\".");
            sb.AppendLine("");

            sb.AppendLine("IV. Thoát:");
            sb.AppendLine("    - Để thoát khỏi chương trình, nhấn nút \"Đóng\" (dấu X ở góc trên bên phải).");
            sb.AppendLine("");

            sb.AppendLine("Lưu ý:");
            sb.AppendLine("- Các chức năng quản lý (thêm, sửa, xóa) chỉ dành cho tài khoản admin.");
            sb.AppendLine("- Vui lòng liên hệ quản trị viên nếu bạn gặp bất kỳ vấn đề nào trong quá trình sử dụng.");

            string markdownText = sb.ToString();

            return sb.ToString();
        }

        private void traCứuSảnPhẩmToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmTCSanPham frm = new frmTCSanPham();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void nhânViênToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmQLNhanVien frm = new frmQLNhanVien();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void kháchHàngToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmQLKhachHang frm = new frmQLKhachHang();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void tàiKhoảnToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmQLTaiKhoan frm = new frmQLTaiKhoan();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void nhàCungCấpToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmQLNhaCungCap frm = new frmQLNhaCungCap();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void traCứuNhânViênToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmTCNhanVien frm = new frmTCNhanVien();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void traCứuKháchHàngToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmTCKhachHang frm = new frmTCKhachHang();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void traCứuTàiKhoảnToolStripMenuItem_Click(object sender, EventArgs e)
        {
            frmTCTaiKhoan frm = new frmTCTaiKhoan();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void tinhToantoolStripMenuItem2_Click(object sender, EventArgs e)
        {
            frmTinhToan frm = new frmTinhToan();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void thongKetoolStripMenuItem1_Click(object sender, EventArgs e)
        {
            frmThongKe frm = new frmThongKe();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void baoBieutoolStripMenuItem3_Click(object sender, EventArgs e)
        {
            frmBaoBieu frm = new frmBaoBieu();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void lapHoaDontoolStripMenuItem1_Click(object sender, EventArgs e)
        {
            frmLapHoaDon frm = new frmLapHoaDon();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void nhanSanPhamtoolStripMenuItem2_Click(object sender, EventArgs e)
        {
            frmNhapSanPham frm = new frmNhapSanPham();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }

        private void toolStripMenuItem1_Click(object sender, EventArgs e)
        {
            frmThanhToanHoaDon frm = new frmThanhToanHoaDon();
            this.Hide();
            frm.ShowDialog();
            this.Show();
        }
    }
}