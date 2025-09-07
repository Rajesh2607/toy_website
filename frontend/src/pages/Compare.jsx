import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

const Compare = () => {
  const [compareItems, setCompareItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const savedCompare = localStorage.getItem('toyStore_compare');
    if (savedCompare) {
      const compareIds = JSON.parse(savedCompare);
      const items = products.filter(product => compareIds.includes(product.id));
      setCompareItems(items);
    }
  }, []);

  const removeFromCompare = (productId) => {
    const updatedItems = compareItems.filter(item => item.id !== productId);
    setCompareItems(updatedItems);
    
    const compareIds = updatedItems.map(item => item.id);
    localStorage.setItem('toyStore_compare', JSON.stringify(compareIds));
  };

  const clearAll = () => {
    setCompareItems([]);
    localStorage.removeItem('toyStore_compare');
  };

  if (compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-8xl block mb-6">⚖️</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No products to compare</h2>
          <p className="text-gray-600 mb-8">
            Add products to compare their features, prices, and specifications.
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

  const features = ['price', 'rating', 'brand', 'ageGroup', 'category'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Compare Products</h1>
        <button
          onClick={clearAll}
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Product Images and Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {compareItems.map((product) => (
              <div key={product.id} className="card p-4 relative">
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove from compare"
                >
                  ✕
                </button>
                
                <div className="overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <h3 className="font-semibold text-gray-800 mb-2 min-h-[3rem]">
                  {product.name}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-semibold text-primary-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-semibold">⭐ {product.rating}</span>
                  </div>
                  
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold">{product.brand}</span>
                    </div>
                  )}
                  
                  {product.ageGroup && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-semibold">{product.ageGroup}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {product.features && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-600 text-xs">Features:</span>
                      <ul className="mt-1 space-y-1">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <span className="text-green-500 mr-1">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => addToCart(product, 1, product.colors[0])}
                    disabled={!product.inStock}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      product.inStock
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
                  </button>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full border border-primary-500 text-primary-500 hover:bg-primary-50 py-2 px-4 rounded-lg font-semibold transition-colors block text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {compareItems.length < 4 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700">
                💡 You can compare up to 4 products. Browse our catalog to add more items for comparison.
              </p>
              <Link
                to="/"
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Continue Shopping →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
