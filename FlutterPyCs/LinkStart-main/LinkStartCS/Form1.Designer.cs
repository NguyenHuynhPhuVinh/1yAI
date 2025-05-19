partial class Form1
{
    private System.ComponentModel.IContainer components = null;
    private Button btnStart;
    private Label lblStatus;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    private void InitializeComponent()
    {
        this.SuspendLayout();

        // Nút Start với thiết kế hiện đại
        this.btnStart = new Button();
        this.btnStart.Text = "BẮT ĐẦU";
        this.btnStart.Size = new Size(200, 50);
        this.btnStart.Location = new Point(50, 30);
        this.btnStart.FlatStyle = FlatStyle.Flat;
        this.btnStart.BackColor = Color.FromArgb(0, 122, 204);
        this.btnStart.ForeColor = Color.White;
        this.btnStart.Font = new Font("Segoe UI", 12F, FontStyle.Bold);
        this.btnStart.Cursor = Cursors.Hand;

        // Label hiển thị trạng thái
        this.lblStatus = new Label();
        this.lblStatus.Size = new Size(200, 30);
        this.lblStatus.Location = new Point(50, 100);
        this.lblStatus.TextAlign = ContentAlignment.MiddleCenter;
        this.lblStatus.Font = new Font("Segoe UI", 9F);
        this.lblStatus.ForeColor = Color.Gray;

        // Form chính
        this.ClientSize = new Size(300, 150);
        this.Controls.AddRange(new Control[] { btnStart, lblStatus });
        this.Name = "Form1";
        this.Text = "LinkStart";
        this.StartPosition = FormStartPosition.CenterScreen;
        this.BackColor = Color.White;
        this.FormBorderStyle = FormBorderStyle.FixedSingle;
        this.MaximizeBox = false;

        this.ResumeLayout(false);
    }
} 