import { apiService } from './api.js';

// Authentication service
class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = this.getStoredUser();
  }

  // Get stored user from localStorage
  getStoredUser() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Store user data
  storeUser(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  // Clear user data
  clearUser() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    
    // Clear cart and wishlist data on logout
    localStorage.removeItem('cartItems');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('compareList');
    
    console.log('🧹 User data, cart, and wishlist cleared on logout');
  }

  // Login
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login', {
        email,
        password,
      });

      if (response.success) {
        this.storeUser(response.user, response.token);
        return { success: true, user: response.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);

      if (response.success) {
        this.storeUser(response.user, response.token);
        return { success: true, user: response.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  }

  // Logout
  async logout() {
    try {
      if (this.token) {
        await apiService.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearUser();
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get user profile from server
  async getProfile() {
    try {
      if (!this.token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await apiService.get('/auth/profile');
      if (response.success) {
        this.storeUser(response.user, this.token);
        return { success: true, user: response.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error('Profile fetch error:', error);
      this.clearUser();
      return { success: false, message: error.message || 'Failed to get profile' };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiService.post('/auth/refresh');
      if (response.success) {
        this.token = response.token;
        localStorage.setItem('authToken', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearUser();
      return false;
    }
  }

  // Update profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      if (response.success) {
        this.storeUser(response.user, this.token);
        return { success: true, user: response.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message || 'Profile update failed' };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: response.success, message: response.message };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, message: error.message || 'Password change failed' };
    }
  }
}

export const authService = new AuthService();
export default authService;
