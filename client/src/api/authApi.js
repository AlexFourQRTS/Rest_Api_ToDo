const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

export const authApi = {
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Помилка входу');
      }

      const data = await response.json();
      if (data.tokens && data.tokens.accessToken) {
        localStorage.setItem('token', data.tokens.accessToken);
      }
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Помилка входу');
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Помилка реєстрації');
      }

      const data = await response.json();
      if (data.tokens && data.tokens.accessToken) {
        localStorage.setItem('token', data.tokens.accessToken);
      }
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Помилка реєстрації');
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Помилка отримання профілю');
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  },

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
    } finally {
      localStorage.removeItem('token');
    }
  },

  async refresh() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Помилка оновлення токена');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      authApi.logout();
      return null;
    }
  },

  async changePassword(passwords) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Не авторизовано');
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Помилка зміни пароля');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Помилка зміни пароля');
    }
  },

  async getAdminUsers() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Не авторизовано');
      }

      const response = await fetch(`${API_URL}/auth/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Помилка отримання списку користувачів');
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
}; 