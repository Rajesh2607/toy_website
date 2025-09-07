import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { formatPrice } from '../utils/currency';
import { showLoginRequired } from '../utils/notifications';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/products/${id}`);
        if (response.success) {
          setProduct(response.data);
          
          // Check wishlist and compare status
          const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
          
          setIsInWishlist(wishlist.some(item => item.id === response.data.id));
          setIsInCompare(compareList.some(item => item.id === response.data.id));

          // Fetch related products
          const relatedResponse = await apiService.get(`/products?category=${response.data.category}&limit=4`);
          if (relatedResponse.success) {
            const related = (relatedResponse.products || relatedResponse.data || [])
              .filter(p => p.id !== response.data.id)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Set default color when product loads
  useEffect(() => {
    if (product && !selectedColor && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

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
    addToCart(product, quantity, selectedColor);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlist = async () => {
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
    
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const handleCompare = () => {
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
    
    window.dispatchEvent(new Event('compareUpdated'));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400 text-xl">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-xl">⭐</span>}
        <span className="text-lg text-gray-600 ml-2">({rating})</span>
      </div>
    );
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>→</span>
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span>→</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>
        
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <span>←</span>
          <span>Back to Products</span>
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl shadow-lg group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold animate-pulse">
                {discountPercentage}% OFF
              </div>
            )}
            
            {/* Share Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Share Product"
              >
                📤
              </button>
            </div>
          </div>
          
          {/* Product Features Quick View */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="font-semibold text-primary-600">🚚 Free Shipping</div>
              <div className="text-gray-600">On orders ₹2,000+</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <div className="font-semibold text-primary-600">🔒 Secure Payment</div>
              <div className="text-gray-600">100% Safe & Secure</div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            {renderStars(product.rating)}
          </div>

          <div className="text-4xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.colors.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Choose Color:</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                      selectedColor === color ? 'border-gray-800' : 'border-gray-300'
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
              <p className="text-sm text-gray-600 capitalize">
                Selected: {selectedColor}
              </p>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-800">Quantity:</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-200 ${
                product.inStock
                  ? isAdding
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAdding ? '✓ Added to Cart!' : product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleWishlist}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isInWishlist
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'border-2 border-red-500 text-red-500 hover:bg-red-50'
                }`}
              >
                💖 {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              
              <button
                onClick={handleCompare}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isInCompare
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'border-2 border-purple-500 text-purple-500 hover:bg-purple-50'
                }`}
              >
                ⚖️ {isInCompare ? 'Remove from Compare' : 'Add to Compare'}
              </button>
            </div>

            <Link
              to="/cart"
              className="w-full block text-center py-4 px-8 rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold text-lg transition-colors"
            >
              View Cart
            </Link>
          </div>

          {/* Product Features */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Product Features:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Safe materials - BPA free</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Age appropriate design</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Educational value</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Durable construction</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="card p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={relatedProduct.image || relatedProduct.images?.[0] || '/api/placeholder/200/200'}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-primary-600 font-bold">
                  {formatPrice(relatedProduct.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;