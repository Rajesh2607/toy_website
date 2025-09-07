import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LazyImage from '../components/LazyImage';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useInfiniteScroll } from '../hooks/useOptimization';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch categories with product counts
  const { 
    categories, 
    loading: categoriesLoading,
    error: categoriesError 
  } = useCategories({ includeCounts: true });

  // Create filters for products
  const filters = useMemo(() => {
    const productFilters = {};
    if (selectedCategory !== 'all') {
      productFilters.category = selectedCategory;
    }
    return productFilters;
  }, [selectedCategory]);

  // Fetch products for selected category
  const {
    products,
    loading: productsLoading,
    error: productsError,
    loadMore,
    hasMore,
  } = useProducts(filters, { enablePagination: true });

  // Infinite scroll setup
  const { sentinelRef } = useInfiniteScroll(
    loadMore,
    hasMore && !productsLoading
  );

  // Add "All" category to categories list
  const allCategories = useMemo(() => {
    const totalProducts = categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0);
    return [
      { 
        id: 'all', 
        name: 'All Categories', 
        icon: '🧸', 
        productCount: totalProducts,
        description: 'Browse all available products'
      },
      ...categories
    ];
  }, [categories]);

  const currentCategory = allCategories.find(c => c.id === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h1>
        <p className="text-gray-600 text-lg">
          Discover amazing toys organized by categories to find exactly what you're looking for.
        </p>
      </div>

      {/* Categories Error */}
      {categoriesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">Error loading categories: {categoriesError}</p>
        </div>
      )}

      {/* Category Grid */}
      {categoriesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="p-6 rounded-xl bg-white border animate-pulse">
              <div className="w-12 h-12 bg-gray-300 rounded mx-auto mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
              title={category.description}
            >
              {category.image ? (
                <LazyImage
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 mx-auto mb-3 rounded-full object-cover"
                  imgClassName="w-12 h-12 rounded-full object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="text-4xl mb-3">{category.icon || '📦'}</div>
              )}
              <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
              <span className="text-xs opacity-75">
                {category.productCount || 0} {(category.productCount || 0) === 1 ? 'toy' : 'toys'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Category Header */}
      {currentCategory && (
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">
              {currentCategory.icon || '📦'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentCategory.name}
              </h2>
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'toy' : 'toys'} available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Loading */}
      {productsLoading && products.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="bg-gray-300 h-48 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products Error */}
      {productsError && (
        <div className="text-center py-16">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-semibold">Failed to load products</p>
            <p className="text-sm text-gray-600 mt-2">{productsError}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!productsLoading && !productsError && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                lazy={index > 7}
              />
            ))}
          </div>

          {/* Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* No more products message */}
          {!hasMore && products.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>You've seen all products in this category!</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!productsLoading && !productsError && products.length === 0 && (
        <div className="text-center py-16">
          <span className="text-8xl block mb-6">🔍</span>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No toys found in this category
          </h3>
          <p className="text-gray-600 mb-6">
            Try selecting a different category or browse all toys.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Show All Toys
          </button>
        </div>
      )}

      {/* Category Features */}
      <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-pink/10 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Why Choose Our Categories? 🌟
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="font-semibold text-lg mb-2">Easy to Find</h4>
            <p className="text-gray-600">Organized categories make it simple to find the perfect toy for any child.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h4 className="font-semibold text-lg mb-2">Quality Assured</h4>
            <p className="text-gray-600">Every toy in every category meets our strict quality and safety standards.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h4 className="font-semibold text-lg mb-2">Age Appropriate</h4>
            <p className="text-gray-600">All toys are clearly marked with appropriate age ranges for safe play.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
