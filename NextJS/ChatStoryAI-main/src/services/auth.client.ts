interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthClient {
  static async register(data: RegisterData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async login(data: LoginData) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updateUsername(newUsername: string) {
    const response = await fetch('/api/user/update-username', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: newUsername }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updatePassword(currentPassword: string, newPassword: string) {
    const response = await fetch('/api/user/update-password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async deleteAccount(password: string) {
    const response = await fetch('/api/user/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updateAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/user/update-avatar', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async forgotPassword(email: string) {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async verifyResetCode(email: string, code: string) {
    const response = await fetch('/api/auth/verify-reset-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async resetPassword(email: string, code: string, newPassword: string) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }

  static async updateBadge() {
    const response = await fetch('/api/user/update-badge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return result;
  }
} 