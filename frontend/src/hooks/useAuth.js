import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const requireAuth = (action = 'access this feature') => {
    if (!context.user) {
      // Store the intended action for after login
      sessionStorage.setItem('authRedirect', window.location.pathname);
      sessionStorage.setItem('authAction', action);
      
      // Show a message and redirect to login
      const proceed = window.confirm(
        `You need to be logged in to ${action}. Would you like to login now?`
      );
      
      if (proceed) {
        navigate('/login');
      }
      
      return false;
    }
    return true;
  };

  const requireAuthWithMessage = (actionName, customMessage) => {
    if (!context.user) {
      const message = customMessage || `Please login to ${actionName}`;
      
      // Store redirect info
      sessionStorage.setItem('authRedirect', window.location.pathname);
      sessionStorage.setItem('authAction', actionName);
      
      // Show notification
      const proceed = window.confirm(`${message}\n\nWould you like to login now?`);
      
      if (proceed) {
        navigate('/login');
      }
      
      return false;
    }
    return true;
  };

  return {
    ...context,
    requireAuth,
    requireAuthWithMessage,
    isLoggedIn: !!context.user
  };
};
