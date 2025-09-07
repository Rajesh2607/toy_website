import { useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import { showLoginRequired } from '../utils/notifications';
import LazyImage from './LazyImage';

const ProductCard = memo(({ product, lazy = false, priority = false }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'default');
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);

  // Check if product is in wishlist and compare on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    setIsInWishlist(wishlist.some(item => item.id === product.id));
    setIsInCompare(compareList.some(item => item.id === product.id));
  }, [product.id]);

  const handleAddToCart = async () => {
    if (!user) {
      const proceed = await showLoginRequired('add items to cart', product.name);
      
      if (proceed) {
        sessionStorage.setItem('authRedirect', window.location.pathname);
        sessionStorage.setItem('authAction', `add "${product.name}" to cart`);
        navigate('/login');
      }
      return;
    }

    setIsAdding(true);
    addToCart(product, 1, selectedColor);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      const proceed = await showLoginRequired('add items to wishlist', product.name);
      
      if (proceed) {
        sessionStorage.setItem('authRedirect', window.location.pathname);
        sessionStorage.setItem('authAction', `add "${product.name}" to wishlist`);
        navigate('/login');
      }
      return;
    }
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      const updatedWishlist = wishlist.filter(item => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
    
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (isInCompare) {
      const updatedCompareList = compareList.filter(item => item.id !== product.id);
      localStorage.setItem('compareList', JSON.stringify(updatedCompareList));
      setIsInCompare(false);
    } else {
      if (compareList.length >= 4) {
        alert('You can compare maximum 4 products at once');
        return;
      }
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      setIsInCompare(true);
    }
    
    // Dispatch custom event to update header counter
    window.dispatchEvent(new Event('compareUpdated'));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
        {product.reviews && (
          <span className="text-xs text-gray-500 ml-1">• {product.reviews} reviews</span>
        )}
      </div>
    );
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="card p-4 group relative">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist & Compare Buttons */}
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <button
          onClick={handleWishlist}
          className={`p-1.5 rounded-full transition-colors ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
          title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          💖
        </button>
        
        <button
          onClick={handleCompare}
          className={`p-1.5 rounded-full transition-colors ${
            isInCompare 
              ? 'bg-purple-500 text-white' 
              : 'bg-white bg-opacity-80 text-gray-600 hover:bg-purple-500 hover:text-white'
          }`}
          title={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
        >
          ⚖️
        </button>
      </div>
      
      <div className="relative overflow-hidden rounded-lg mb-4">
        <Link to={`/product/${product.id}`}>
          <LazyImage
            src={product.image}
            alt={product.name}
            lazy={lazy}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            imgClassName="w-full h-48 object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={85}
          />
        </Link>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="bg-accent-yellow text-white px-2 py-1 rounded-full text-xs font-semibold">
            {product.brand || 'NEW'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {renderStars(product.rating)}

        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Age Group */}
        {product.ageGroup && (
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
            👶 Age: {product.ageGroup}
          </div>
        )}

        {/* Color Selection */}
        {product.colors.length > 1 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <div className="flex space-x-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{
                    backgroundColor: color === 'multicolor' ? 
                      'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' : 
                      color
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2 pt-2">
          {/* Price Section */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <Link
              to={`/product/${product.id}`}
              className="w-full block text-center px-4 py-2 rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold transition-colors"
            >
              👁️ View Details
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                product.inStock
                  ? isAdding
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAdding ? '✓ Added!' : product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;