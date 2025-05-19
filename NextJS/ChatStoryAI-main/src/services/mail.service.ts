import nodemailer from 'nodemailer';

export class MailService {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  static async sendResetCode(email: string, resetCode: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu - ChatStoryAI',
        html: `
          <h2>Xin chào!</h2>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu trên ChatStoryAI.</p>
          <p>Mã xác thực của bạn là: <strong>${resetCode}</strong></p>
          <p>Mã này sẽ hết hạn sau 5 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        `
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email');
    }
  }
} 