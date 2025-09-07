import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { formatPrice } from '../utils/currency';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Link to="/" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Set default color if not selected
  if (!selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedColor);
    setTimeout(() => setIsAdding(false), 1000);
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
        {product.reviews && (
          <span className="text-sm text-gray-500 ml-2">• {product.reviews} reviews</span>
        )}
      </div>
    );
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>→</span>
        <span className="capitalize">{product.category.replace('-', ' ')}</span>
        <span>→</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold">
                {discountPercentage}% OFF
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {product.brand && (
                <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
              )}
              {product.ageGroup && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">👶 {product.ageGroup}</span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            {renderStars(product.rating)}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-2xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Save {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Product Specifications */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.dimensions && (
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <p className="text-gray-600">{product.dimensions}</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <p className="text-gray-600">{product.weight}</p>
                </div>
              )}
            </div>
          </div>

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

          {/* Add to Cart */}
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

            <Link
              to="/cart"
              className="w-full block text-center py-4 px-8 rounded-lg border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold text-lg transition-colors"
            >
              View Cart
            </Link>
          </div>

          {/* Shipping Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">🚚 Free Shipping</h3>
            <p className="text-sm text-green-700">
              Free delivery on orders above ₹2,000. Delivered in 3-5 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['description', 'features', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === 'features' && product.features && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Product Features:</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="text-green-500 text-lg">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {renderStars(product.rating)}
                <span className="text-sm text-gray-500">
                  Based on {product.reviews || 0} reviews
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">
                  Customer reviews will be displayed here. This is a demo section showing the review functionality.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
                className="card p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-800 mb-2">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-primary-600 font-bold">
                    {formatPrice(relatedProduct.price)}
                  </span>
                  {relatedProduct.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(relatedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
