using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace CuaHangDienThoai
{
    public partial class frmThongKe : Form
    {
        private readonly string connectionString = @"Data Source=TOMISAKAE;Initial Catalog=CHDT;Integrated Security=True";

        public frmThongKe()
        {
            InitializeComponent();
        }

        private void frmThongKe_Load(object sender, EventArgs e)
        {
            // Remove existing charts if any
            this.Controls.OfType<Chart>().ToList().ForEach(c => this.Controls.Remove(c));

            // Set dark theme colors globally for the form
            this.BackColor = Color.FromArgb(46, 51, 73);
            lblTitle.ForeColor = Color.White;

            // Configure the TableLayoutPanel (do this in the Designer for easier setup)
            tlpChartLayout.ColumnCount = 3;
            tlpChartLayout.RowCount = 3;

            tlpChartLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333F));
            tlpChartLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333F));
            tlpChartLayout.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.3333F));
            tlpChartLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 33.3333F));
            tlpChartLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 33.3333F));
            tlpChartLayout.RowStyles.Add(new RowStyle(SizeType.Percent, 33.3333F));
            // Add the TableLayoutPanel to the form
            this.Controls.Add(tlpChartLayout);

            // Load the title spanning all 3 columns in the first row
            Label titleLabel = new Label();
            titleLabel.Text = "Báo Cáo Thống Kê";
            titleLabel.Font = new Font("Segoe UI", 16, FontStyle.Bold);
            titleLabel.ForeColor = Color.White;
            titleLabel.TextAlign = ContentAlignment.MiddleCenter;
            titleLabel.Dock = DockStyle.Fill;
            tlpChartLayout.Controls.Add(titleLabel, 0, 0);
            tlpChartLayout.SetColumnSpan(titleLabel, 3);


            LoadTopSellingProductsChart(1, 0, 2, 1);
            LoadTopEmployeesChart(1, 2, 1, 1);
            LoadTopCustomersChart(2, 0, 2, 1); // Span 2 columns
            LoadSalesByPaymentMethod(1, 1, 1, 1);
        }

        private void LoadSalesByPaymentMethod(int row, int column, int colSpan, int rowSpan)
        {
            Chart chart = CreateChart("Doanh Thu Theo Phương Thức Thanh Toán", DockStyle.None, ChartValueType.Int32);
            Series series = CreateSeries("Doanh Thu", SeriesChartType.Pie, ChartValueType.String);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = @"
                        SELECT PhuongThucThanhToan, SUM(TongTien) AS TongDoanhThu
                        FROM HoaDon
                        GROUP BY PhuongThucThanhToan";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string paymentMethod = reader.GetString(0);
                                int totalSales = (int)reader.GetDouble(1);

                                // Correctly add data points with labels
                                series.Points.Add(new DataPoint(0, totalSales) { Label = paymentMethod });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }

            chart.Series.Add(series);
            CustomizeChart(chart);
            chart.Dock = DockStyle.Fill;
            tlpChartLayout.Controls.Add(chart, column, row);
            tlpChartLayout.SetColumnSpan(chart, colSpan);
            tlpChartLayout.SetRowSpan(chart, rowSpan);
        }

        private void LoadTopSellingProductsChart(int row, int column, int colSpan, int rowSpan)
        {
            Chart chart = CreateChart("Top Sản Phẩm Bán Chạy", DockStyle.None, ChartValueType.Int32);
            Series series = CreateSeries("Sản Phẩm", SeriesChartType.Bar, ChartValueType.String);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();

                    // Modified query to select all products with sales
                    string query = @"SELECT TenSanPham, SUM(CAST(SoLuong AS INT)) AS TongSoLuong
                             FROM ChiTietHoaDon
                             JOIN SanPham ON ChiTietHoaDon.MaSanPham = SanPham.MaSanPham
                             GROUP BY TenSanPham
                             ORDER BY TongSoLuong DESC";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string productName = reader.GetString(0);
                                int totalQuantity = reader.GetInt32(1);
                                series.Points.AddXY(productName, totalQuantity);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }

            chart.Series.Add(series);
            CustomizeChart(chart);
            // Add chart to TableLayoutPanel 
            chart.Dock = DockStyle.Fill;
            tlpChartLayout.Controls.Add(chart, column, row);
            tlpChartLayout.SetColumnSpan(chart, colSpan);
            tlpChartLayout.SetRowSpan(chart, rowSpan);
        }

        private void LoadTopEmployeesChart(int row, int column, int colSpan, int rowSpan)
        {
            Chart chart = CreateChart("Top 3 Nhân Viên Bán Hàng Xuất Sắc", DockStyle.None, ChartValueType.Double);
            Series series = CreateSeries("Nhân Viên", SeriesChartType.Doughnut, ChartValueType.String);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = @"SELECT TOP 3 TenNhanVien, SUM(TongTien) AS TongDoanhThu
                            FROM HoaDon
                            JOIN NhanVien ON HoaDon.MaNhanVien = NhanVien.MaNhanVien
                            GROUP BY TenNhanVien
                            ORDER BY TongDoanhThu DESC";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string employeeName = reader.GetString(0);
                                double totalRevenue = (double)reader.GetDouble(1);

                                // Correctly add data points with labels
                                series.Points.Add(new DataPoint(0, totalRevenue) { Label = employeeName });
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }

            chart.Series.Add(series);
            CustomizeChart(chart);
            chart.Dock = DockStyle.Fill;
            tlpChartLayout.Controls.Add(chart, column, row);
            tlpChartLayout.SetColumnSpan(chart, colSpan);
            tlpChartLayout.SetRowSpan(chart, rowSpan);
        }

        private void LoadTopCustomersChart(int row, int column, int colSpan, int rowSpan)
        {
            Chart chart = CreateChart("Top 3 Khách Hàng Mua Nhiều Nhất", DockStyle.None, ChartValueType.Double);
            Series series = CreateSeries("Khách Hàng", SeriesChartType.Bar, ChartValueType.String);

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    string query = @"SELECT TOP 3 TenKhachHang, SUM(TongTien) AS TongChiTieu
                             FROM HoaDon
                             JOIN KhachHang ON HoaDon.MaKhachHang = KhachHang.MaKhachHang
                             GROUP BY TenKhachHang
                             ORDER BY TongChiTieu DESC";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string customerName = reader.GetString(0);
                                double totalSpending = (double)reader.GetDouble(1);
                                series.Points.AddXY(customerName, totalSpending);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Lỗi: " + ex.Message);
                }
            }

            chart.Series.Add(series);
            CustomizeChart(chart);
            // Add chart to TableLayoutPanel
            chart.Dock = DockStyle.Fill;
            tlpChartLayout.Controls.Add(chart, column, row);
            tlpChartLayout.SetColumnSpan(chart, colSpan);
            tlpChartLayout.SetRowSpan(chart, rowSpan);
        }

        private Chart CreateChart(string title, DockStyle dockStyle, ChartValueType yValueType)
        {
            Chart chart = new Chart();
            chart.Dock = dockStyle;
            chart.Width = this.Width / 2 - 10;
            chart.Height = 300;

            ChartArea area = new ChartArea();
            chart.ChartAreas.Add(area);
            chart.Titles.Add(title).Font = new Font("Segoe UI", 14, FontStyle.Bold);
            chart.Titles[0].ForeColor = Color.White;

            // Set Y-axis value type
            chart.ChartAreas[0].AxisY.LabelStyle.Format = "{0:N0}";
            chart.ChartAreas[0].AxisY.IsStartedFromZero = true;
            chart.ChartAreas[0].AxisY.LabelStyle.ForeColor = Color.White;

            // Set X-axis value type
            chart.ChartAreas[0].AxisX.LabelStyle.ForeColor = Color.White;

            return chart;
        }

        private Series CreateSeries(string name, SeriesChartType type, ChartValueType xValueType)
        {
            Series series = new Series();
            series.ChartType = type;
            series.Name = name;
            series.XValueType = xValueType;

            // Additional customization for Pie and Doughnut charts
            if (type == SeriesChartType.Pie || type == SeriesChartType.Doughnut)
            {
                series["PieLabelStyle"] = "Outside"; // Display labels outside
                series["PieLineColor"] = "White"; // Color of the line connecting label and slice
                series.LabelForeColor = Color.White; // Label text color
                series.Font = new Font("Segoe UI", 9, FontStyle.Bold); // Label font
            }

            return series;
        }
        private void CustomizeChart(Chart chart)
        {
            // Common customization
            chart.BackColor = Color.FromArgb(46, 51, 73);
            chart.ChartAreas[0].BackColor = Color.FromArgb(46, 51, 73);
            chart.ChartAreas[0].AxisX.MajorGrid.LineWidth = 0;
            chart.ChartAreas[0].AxisY.MajorGrid.LineColor = Color.FromArgb(70, 70, 70);
            chart.ChartAreas[0].AxisY.LabelStyle.ForeColor = Color.White;
            chart.ChartAreas[0].AxisX.LabelStyle.ForeColor = Color.White;

            // Customize legend
            Legend legend = new Legend();
            chart.Legends.Add(legend);
            legend.BackColor = Color.FromArgb(46, 51, 73);
            legend.ForeColor = Color.White;
            legend.Font = new Font("Segoe UI", 9, FontStyle.Regular);

            // Customize series colors
            if (chart.Series.Any())
            {
                // Set custom colors for the first series
                chart.Series[0].Palette = ChartColorPalette.None;
                chart.Series[0].Color = Color.FromArgb(0, 126, 249);
                chart.Series[0].BorderColor = Color.FromArgb(46, 51, 73);

                // Set specific colors and label settings for Pie and Doughnut charts
                if (chart.Series[0].ChartType == SeriesChartType.Pie || chart.Series[0].ChartType == SeriesChartType.Doughnut)
                {
                    // Ensure labels are displayed correctly
                    chart.Series[0]["PieLabelStyle"] = "Outside";
                    chart.Series[0]["PieLineColor"] = "White";
                    chart.Series[0].LabelForeColor = Color.White;
                    chart.Series[0].Font = new Font("Segoe UI", 9, FontStyle.Bold);
                    chart.Series[0].Label = "#LABEL"; // Use #LABEL to display the Label property of each DataPoint
                }
            }
        }

    }
}