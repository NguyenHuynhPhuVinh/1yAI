using System.Drawing;
using System.Windows.Forms;

public class CustomRenderer : ToolStripProfessionalRenderer
{
    protected override void OnRenderMenuItemBackground(ToolStripItemRenderEventArgs e)
    {
        if (!e.Item.Selected)
        {
            // Màu nền khi không được chọn (màu của menuStrip1)
            e.Item.BackColor = Color.FromArgb(24, 30, 54);
            e.Graphics.FillRectangle(new SolidBrush(e.Item.BackColor), new Rectangle(Point.Empty, e.Item.Size));
        }
        else
        {
            // Màu nền khi được chọn (màu highlight)
            e.Graphics.FillRectangle(Brushes.LightBlue, new Rectangle(Point.Empty, e.Item.Size));
        }

        if (e.Item is ToolStripMenuItem && (e.Item as ToolStripMenuItem).DropDown.Visible)
        {
             //Màu nền khi là dropdown
             e.Item.BackColor = Color.FromArgb(46, 51, 73);
             e.Graphics.FillRectangle(new SolidBrush(e.Item.BackColor), new Rectangle(Point.Empty, e.Item.Size));
        }
    }

    protected override void OnRenderSeparator(ToolStripSeparatorRenderEventArgs e)
    {
        // Màu của đường phân cách
        e.Graphics.FillRectangle(new SolidBrush(Color.FromArgb(46, 51, 73)), new Rectangle(30, 3, e.Item.Width - 60, 1));
    }

}
