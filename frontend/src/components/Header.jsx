import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ onSearch, searchTerm }) => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };

    const updateCompareCount = () => {
      const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
      setCompareCount(compareList.length);
    };

    // Initial load
    updateWishlistCount();
    updateCompareCount();

    // Listen for custom events
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    window.addEventListener('compareUpdated', updateCompareCount);

    return () => {
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
      window.removeEventListener('compareUpdated', updateCompareCount);
    };
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🧸</span>
            <span className="text-2xl font-bold text-primary-600 font-kid">ToyLand</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for toys..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-primary-400 focus:outline-none"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/categories" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Categories
            </Link>
            
            <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              💖
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/compare" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              ⚖️
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              🛒
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    <span>👤</span>
                    <span>Hi, {user.name}!</span>
                    <span>▼</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span>👤</span>
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span>📦</span>
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span>💖</span>
                        <span>Wishlist</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <span>🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for toys..."
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-primary-400 focus:outline-none"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  🔍
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col space-y-2">
                <Link
                  to="/categories"
                  className="flex items-center justify-between p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <span>📂</span>
                    <span>Categories</span>
                  </span>
                </Link>
                
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <span>💖</span>
                    <span>Wishlist</span>
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-accent-pink text-white text-xs rounded-full px-2 py-1">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/compare"
                  className="flex items-center justify-between p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <span>⚖️</span>
                    <span>Compare</span>
                  </span>
                  {compareCount > 0 && (
                    <span className="bg-accent-purple text-white text-xs rounded-full px-2 py-1">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <span>🛒</span>
                    <span>Cart</span>
                  </span>
                  {getTotalItems() > 0 && (
                    <span className="bg-accent-pink text-white text-xs rounded-full px-2 py-1">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div className="space-y-2">
                    <div className="p-2 text-sm font-medium text-gray-700">
                      Hi, {user.name}!
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>📦</span>
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-left p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="p-2 text-primary-600 hover:text-primary-800 rounded-lg hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="p-2 bg-primary-500 text-white text-center rounded-lg hover:bg-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;