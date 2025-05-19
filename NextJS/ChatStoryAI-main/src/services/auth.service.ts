/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  isGoogleUser?: boolean;
  avatar?: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const { username, email, password, isGoogleUser, avatar } = data;

    try {
      // Check if email exists
      const [existingUsers] = await pool.execute(
        'SELECT email FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        throw new Error('Email đã được sử dụng');
      }

      // Hash password only if not Google user
      const hashedPassword = isGoogleUser ? null : await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, user_password, avatar) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, avatar || null]
      );

      const userId = (result as any).insertId;

      // Fetch user data after insert
      const [users] = await pool.execute(
        'SELECT user_id, username, email, avatar, has_badge FROM users WHERE user_id = ?',
        [userId]
      );

      return {
        message: 'Đăng ký thành công',
        userId: userId,
        user: (users as any[])[0]
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      // Get user by email
      const [users] = await pool.execute(
        'SELECT user_id, username, email, user_password, avatar FROM users WHERE email = ?',
        [email]
      );

      const user = (users as any[])[0];

      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.user_password);

      if (!isValidPassword) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      // Return user data (excluding password)
      const { user_password, ...userData } = user;
      return {
        message: 'Đăng nhập thành công',
        user: userData
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateUsername(userId: number, newUsername: string) {
    try {
      await pool.execute(
        'UPDATE users SET username = ? WHERE user_id = ?',
        [newUsername, userId]
      );

      return {
        message: 'Cập nhật tên thành công',
        username: newUsername
      };
    } catch (error: any) {
      throw new Error('Đã xảy ra lỗi khi cập nhật tên');
    }
  }

  static async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    try {
      // Get user's current password
      const [users] = await pool.execute(
        'SELECT user_password FROM users WHERE user_id = ?',
        [userId]
      );

      const user = (users as any[])[0];
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.user_password);
      if (!isValidPassword) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.execute(
        'UPDATE users SET user_password = ? WHERE user_id = ?',
        [hashedPassword, userId]
      );

      return {
        message: 'Cập nhật mật khẩu thành công'
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async deleteAccount(userId: number, password: string) {
    try {
      // Get user's current password
      const [users] = await pool.execute(
        'SELECT user_password FROM users WHERE user_id = ?',
        [userId]
      );

      const user = (users as any[])[0];
      if (!user) {
        throw new Error('Người dùng không tồn tại');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.user_password);
      if (!isValidPassword) {
        throw new Error('Mật khẩu không đúng');
      }

      // Delete user
      await pool.execute(
        'DELETE FROM users WHERE user_id = ?',
        [userId]
      );

      return {
        message: 'Xóa tài khoản thành công'
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateAvatar(userId: number, avatarUrl: string, driveFileId: string) {
    try {
      await pool.execute(
        'UPDATE users SET avatar = ?, drive_file_id = ? WHERE user_id = ?',
        [avatarUrl, driveFileId, userId]
      );

      return {
        message: 'Cập nhật ảnh đại diện thành công',
        avatar: avatarUrl
      };
    } catch (error: any) {
      throw new Error('Đã xảy ra lỗi khi cập nhật ảnh đại diện');
    }
  }

  static async getUser(userId: number) {
    try {
      const [users] = await pool.execute(
        'SELECT user_id, username, email, avatar, drive_file_id FROM users WHERE user_id = ?',
        [userId]
      );

      return (users as any[])[0];
    } catch (error: any) {
      throw new Error('Đã xảy ra lỗi khi lấy thông tin người dùng');
    }
  }

  static async generateResetCode(email: string) {
    try {
      const [rows] = await pool.execute(
        'SELECT user_id, user_password FROM users WHERE email = ?',
        [email]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('Email không tồn tại trong hệ thống');
      }

      // Kiểm tra nếu là tài khoản Google (user_password là null)
      const user = (rows as any[])[0];
      if (user.user_password === null) {
        throw new Error('Tài khoản Google không thể đặt lại mật khẩu. Vui lòng đăng nhập bằng Google');
      }

      // Tạo mã xác thực ngẫu nhiên 6 chữ số
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

      // Lưu mã xác thực vào database
      await pool.execute(
        'INSERT INTO reset_codes (email, code, expires_at) VALUES (?, ?, ?)',
        [email, resetCode, expiresAt]
      );

      return resetCode;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async verifyResetCode(email: string, code: string) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM reset_codes WHERE email = ? AND code = ? AND expires_at > NOW() AND used = 0',
        [email, code]
      );

      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error('Mã xác thực không hợp lệ hoặc đã hết hạn');
      }

      // Đánh dấu mã đã sử dụng
      await pool.execute(
        'UPDATE reset_codes SET used = 1 WHERE email = ? AND code = ?',
        [email, code]
      );

      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async resetPassword(email: string, newPassword: string) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.execute(
        'UPDATE users SET user_password = ? WHERE email = ?',
        [hashedPassword, email]
      );
      return true;
    } catch (error: any) {
      throw new Error('Không thể cập nhật mật khẩu');
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const [users] = await pool.execute(
        'SELECT user_id, username, email, avatar, has_badge FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(users) && users.length > 0) {
        const user = (users as any[])[0];
        // Chuyển đổi has_badge từ 0/1 thành boolean
        return {
          ...user,
          has_badge: Boolean(user.has_badge)
        };
      }
      return null;
    } catch (error: any) {
      throw new Error('Lỗi khi lấy thông tin người dùng');
    }
  }

  static async updateBadgeStatus(userId: number) {
    try {
      await pool.execute(
        'UPDATE users SET has_badge = ? WHERE user_id = ?',
        [true, userId] // MySQL sẽ tự động chuyển true thành 1
      );

      return {
        message: 'Cập nhật huy hiệu thành công',
        hasBadge: true
      };
    } catch (error: any) {
      throw new Error('Đã xảy ra lỗi khi cập nhật huy hiệu');
    }
  }
} 