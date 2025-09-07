import { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { useProducts, useFeaturedProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDebounce, useInfiniteScroll } from '../hooks/useOptimization';

const Home = ({ searchTerm = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch categories with product counts
  const { categories, loading: categoriesLoading } = useCategories({ 
    includeCounts: true 
  });

  // Fetch featured products
  const { 
    featuredProducts: rawFeaturedProducts, 
    loading: featuredLoading 
  } = useFeaturedProducts();

  // Ensure featuredProducts is always an array
  const featuredProducts = rawFeaturedProducts || [];

  // Create filters object for products
  const filters = useMemo(() => {
    const productFilters = {};
    
    if (selectedCategory !== 'all') {
      productFilters.category = selectedCategory;
    }
    
    if (debouncedSearchTerm) {
      productFilters.search = debouncedSearchTerm;
    }
    
    if (sortBy) {
      productFilters.sortBy = sortBy;
    }

    if (showFeaturedOnly) {
      productFilters.featured = true;
    }
    
    return productFilters;
  }, [selectedCategory, debouncedSearchTerm, sortBy, showFeaturedOnly]);

  // Fetch products with infinite scroll
  const {
    products: rawProducts,
    loading: productsLoading,
    error: productsError,
    loadMore,
    hasMore,
  } = useProducts(filters, {
    enablePagination: true,
  });

  // Ensure products is always an array
  const products = rawProducts || [];

  // Infinite scroll setup
  const { sentinelRef } = useInfiniteScroll(
    loadMore,
    hasMore && !productsLoading
  );

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero featuredProducts={featuredProducts} loading={featuredLoading} />
      
      <div className="container mx-auto px-4 pb-16">
        {/* Featured Products Section */}
        {!showFeaturedOnly && featuredProducts.length > 0 && !debouncedSearchTerm && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular and loved toys</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  lazy={true}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowFeaturedOnly(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>View All Featured Products</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            loading={categoriesLoading}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-800">
              {debouncedSearchTerm ? (
                <>Search results for "{debouncedSearchTerm}"</>
              ) : showFeaturedOnly ? (
                'Featured Products'
              ) : (
                selectedCategory === 'all' 
                  ? 'All Products' 
                  : categories.find(c => c.id === selectedCategory)?.name || 'Products'
              )}
            </h3>
            
            {showFeaturedOnly && (
              <button
                onClick={() => setShowFeaturedOnly(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to all products
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
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

        {/* Error State */}
        {productsError && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-semibold">Oops! Something went wrong</p>
              <p className="text-sm text-gray-600 mt-2">{productsError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
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
                  lazy={index > 7} // Only lazy load after first 8 products
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
                <p>You've seen all products!</p>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!productsLoading && !productsError && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm text-gray-600 mt-2">
                {debouncedSearchTerm 
                  ? `No products match "${debouncedSearchTerm}"`
                  : 'No products available in this category'
                }
              </p>
            </div>
            
            {(debouncedSearchTerm || selectedCategory !== 'all') && (
              <div className="space-x-4">
                {debouncedSearchTerm && (
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Clear Search
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="btn-secondary"
                  >
                    View All Products
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
