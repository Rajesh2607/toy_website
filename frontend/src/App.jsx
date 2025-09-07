import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header onSearch={setSearchTerm} searchTerm={searchTerm} />
            <main>
              <Routes>
                <Route path="/" element={<Home searchTerm={searchTerm} />} />
                <Route path="/categories" element={<Categories searchTerm={searchTerm} />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12 mt-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-3xl">🧸</span>
                      <span className="text-2xl font-bold font-kid">ToyLand</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Making childhood magical with amazing toys and endless imagination.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="#" className="hover:text-white">About Us</a></li>
                      <li><a href="#" className="hover:text-white">Contact</a></li>
                      <li><a href="#" className="hover:text-white">Help Center</a></li>
                      <li><a href="#" className="hover:text-white">Returns</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="#" className="hover:text-white">Action Figures</a></li>
                      <li><a href="#" className="hover:text-white">Dolls</a></li>
                      <li><a href="#" className="hover:text-white">Educational</a></li>
                      <li><a href="#" className="hover:text-white">Building Blocks</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-4">Connect With Us</h4>
                    <div className="flex space-x-4 text-2xl">
                      <span className="cursor-pointer hover:scale-110 transition-transform">📧</span>
                      <span className="cursor-pointer hover:scale-110 transition-transform">📱</span>
                      <span className="cursor-pointer hover:scale-110 transition-transform">💬</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
                  <p>&copy; 2025 ToyLand. All rights reserved. Made with ❤️ for kids everywhere.</p>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;