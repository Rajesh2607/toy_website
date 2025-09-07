import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const savedWishlist = localStorage.getItem('toyStore_wishlist');
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist);
      const items = products.filter(product => wishlistIds.includes(product.id));
      setWishlistItems(items);
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedItems);
    
    const wishlistIds = updatedItems.map(item => item.id);
    localStorage.setItem('toyStore_wishlist', JSON.stringify(wishlistIds));
  };

  const moveToCart = (product) => {
    addToCart(product, 1, product.colors[0]);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-8xl block mb-6">💖</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">
            Start adding toys you love to keep track of them for later.
          </p>
          <Link
            to="/"
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
          >
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
          {wishlistItems.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div key={product.id} className="card p-4 relative">
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove from wishlist"
            >
              ✕
            </button>
            
            <div className="relative overflow-hidden rounded-lg mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Link to={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-primary-600">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => moveToCart(product)}
                  disabled={!product.inStock}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    product.inStock
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 border border-primary-500 text-primary-500 hover:bg-primary-50 py-2 px-4 rounded-lg font-semibold transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
