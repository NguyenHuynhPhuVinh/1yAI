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
using System.Drawing.Printing;

namespace CuaHangDienThoai
{
    public partial class frmBaoBieu : Form
    {
        string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public frmBaoBieu()
        {
            InitializeComponent();
        }

        private void frmBaoBieu_Load(object sender, EventArgs e)
        {
            LoadData();
            LoadDataToComboBox();
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
                    string query = "SELECT * FROM SanPham";

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
                            dgvSanPham.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvSanPham.Rows.Add(
                                    row["MaSanPham"],
                                    row["MaHang"],
                                    row["TenSanPham"],
                                    row["MoTa"],
                                    row["GiaBan"],
                                    row["SoLuongTonKho"],
                                    row["MauSac"],
                                    row["DungLuong"],
                                    row["HeDieuHanh"],
                                    row["KichThuocManHinh"]
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

        private void LoadDataToComboBox()
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT MaHang, TenHang FROM HangSanXuat";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            cboMaHang.DataSource = dataTable;
                            cboMaHang.DisplayMember = "TenHang";
                            cboMaHang.ValueMember = "MaHang";
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }
        }

        private void btnLoc_Click(object sender, EventArgs e)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = "SELECT * FROM SanPham WHERE MaHang = @MaHang";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@MaHang", cboMaHang.SelectedValue);
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            DataTable dataTable = new DataTable();
                            adapter.Fill(dataTable);

                            dgvSanPham.Rows.Clear();
                            foreach (DataRow row in dataTable.Rows)
                            {
                                dgvSanPham.Rows.Add(
                                    row["MaSanPham"],
                                    row["MaHang"],
                                    row["TenSanPham"],
                                    row["MoTa"],
                                    row["GiaBan"],
                                    row["SoLuongTonKho"],
                                    row["MauSac"],
                                    row["DungLuong"],
                                    row["HeDieuHanh"],
                                    row["KichThuocManHinh"]
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

        private void btnIn_Click(object sender, EventArgs e)
        {
            PrintDocument printDocument = new PrintDocument();
            printDocument.PrintPage += new PrintPageEventHandler(PrintDocument_PrintPage);

            PrintDialog printDialog = new PrintDialog();
            printDialog.Document = printDocument;

            if (printDialog.ShowDialog() == DialogResult.OK)
            {
                printDocument.Print();
            }
        }

        private void PrintDocument_PrintPage(object sender, PrintPageEventArgs e)
        {
            // Thiết lập font và kích thước
            Font titleFont = new Font("Arial", 16, FontStyle.Bold);
            Font headerFont = new Font("Arial", 9, FontStyle.Bold);
            Font contentFont = new Font("Arial", 8);

            // Vị trí bắt đầu và kích thước
            int startX = e.MarginBounds.Left;
            int startY = e.MarginBounds.Top;
            int offset = 40;
            int rowHeight = 30; // Tăng chiều cao của mỗi dòng
            
            // In tiêu đề
            string title = "DANH SÁCH SẢN PHẨM";
            SizeF titleSize = e.Graphics.MeasureString(title, titleFont);
            e.Graphics.DrawString(title, titleFont, Brushes.Black, 
                startX + (e.MarginBounds.Width - titleSize.Width) / 2, startY);

            // Tính toán chiều rộng của các cột (điều chỉnh tỷ lệ)
            int[] columnWidths = new int[] { 60, 70, 130, 150, 80, 90, 70, 70, 70, 70 };
            int totalWidth = columnWidths.Sum();
            float scaleFactor = e.MarginBounds.Width / (float)totalWidth;
            
            // Điều chỉnh chiều rộng cột theo tỷ lệ
            for (int i = 0; i < columnWidths.Length; i++)
            {
                columnWidths[i] = (int)(columnWidths[i] * scaleFactor);
            }

            // In tiêu đề cột
            int currentX = startX;
            int currentY = startY + offset;

            // Vẽ background cho header
            for (int i = 0; i < dgvSanPham.Columns.Count; i++)
            {
                Rectangle headerRect = new Rectangle(currentX, currentY, columnWidths[i], rowHeight);
                e.Graphics.FillRectangle(Brushes.LightGray, headerRect);
                e.Graphics.DrawRectangle(Pens.Black, headerRect);

                // Căn giữa text trong header
                StringFormat format = new StringFormat();
                format.Alignment = StringAlignment.Center;
                format.LineAlignment = StringAlignment.Center;

                e.Graphics.DrawString(dgvSanPham.Columns[i].HeaderText, headerFont, 
                    Brushes.Black, headerRect, format);
                
                currentX += columnWidths[i];
            }

            currentY += rowHeight;

            // In nội dung
            for (int row = 0; row < dgvSanPham.Rows.Count; row++)
            {
                currentX = startX;

                // Kiểm tra xem còn đủ không gian để in không
                if (currentY + rowHeight > e.MarginBounds.Bottom)
                {
                    e.HasMorePages = true;
                    return;
                }

                for (int col = 0; col < dgvSanPham.Columns.Count; col++)
                {
                    Rectangle cellRect = new Rectangle(currentX, currentY, columnWidths[col], rowHeight);
                    e.Graphics.DrawRectangle(Pens.Black, cellRect);

                    if (dgvSanPham.Rows[row].Cells[col].Value != null)
                    {
                        string cellValue = dgvSanPham.Rows[row].Cells[col].Value.ToString();
                        
                        // Căn giữa text trong ô
                        StringFormat format = new StringFormat();
                        format.Alignment = StringAlignment.Center;
                        format.LineAlignment = StringAlignment.Center;
                        
                        // Tự động xuống dòng nếu text quá dài
                        format.Trimming = StringTrimming.EllipsisCharacter;
                        
                        e.Graphics.DrawString(cellValue, contentFont, Brushes.Black, cellRect, format);
                    }
                    
                    currentX += columnWidths[col];
                }

                currentY += rowHeight;
            }

            e.HasMorePages = false;
        }
        private void btnReset_Click(object sender, EventArgs e)
        {
            LoadData();
            cboMaHang.SelectedIndex = -1; // Đặt lại combobox về trạng thái không chọn
        }
    }
}