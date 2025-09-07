import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser && authService.isAuthenticated()) {
        // Verify token is still valid
        const profile = await authService.getProfile();
        if (profile.success) {
          setUser(profile.user);
        } else {
          // Token invalid, clear auth
          authService.clearUser();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      authService.clearUser();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      
      // Clear cart and wishlist from UI immediately
      // Cart is already cleared by authService.clearUser() via localStorage
      // But we also need to clear the React context state
      window.dispatchEvent(new CustomEvent('auth-logout'));
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      setUser(null);
      window.dispatchEvent(new CustomEvent('auth-logout'));
      return { success: true };
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      const result = await authService.updateProfile(updatedUserData);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      }
      
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: error.message || 'Update failed' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, message: error.message || 'Password change failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      changePassword,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
