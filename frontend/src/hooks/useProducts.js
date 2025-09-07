import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '../services/productService.js';

// Custom hook for products with caching and optimization
export const useProducts = (filters = {}, options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const { 
    enablePagination = true, 
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
  } = options;

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);

  // Fetch products function
  const fetchProducts = useCallback(async (newFilters = memoizedFilters, page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryFilters = {
        ...newFilters,
        ...(enablePagination && { page, limit: pagination.limit }),
      };

      const response = await productService.getProducts(queryFilters);
      
      if (response.success) {
        setProducts(response.products || response.data || []);
        
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.pagination,
            page,
          }));
        }
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters, enablePagination, pagination.limit]);

  // Refresh products
  const refresh = useCallback(() => {
    fetchProducts(memoizedFilters, pagination.page);
  }, [fetchProducts, memoizedFilters, pagination.page]);

  // Load more products (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages) {
      try {
        setLoading(true);
        const nextPage = pagination.page + 1;
        
        const queryFilters = {
          ...memoizedFilters,
          page: nextPage,
          limit: pagination.limit,
        };

        const response = await productService.getProducts(queryFilters);
        
        if (response.success) {
          setProducts(prev => [...prev, ...(response.products || response.data || [])]);
          setPagination(prev => ({
            ...prev,
            ...response.pagination,
            page: nextPage,
          }));
        }
      } catch (err) {
        console.error('Error loading more products:', err);
        setError(err.message || 'Failed to load more products');
      } finally {
        setLoading(false);
      }
    }
  }, [memoizedFilters, pagination]);

  // Go to specific page
  const goToPage = useCallback((page) => {
    fetchProducts(memoizedFilters, page);
  }, [fetchProducts, memoizedFilters]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchProducts();

    let interval;
    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(refresh, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchProducts, autoRefresh, refreshInterval]);

  return {
    products,
    loading,
    error,
    pagination,
    refresh,
    loadMore,
    goToPage,
    hasMore: pagination.page < pagination.totalPages,
  };
};

// Custom hook for single product
export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProductById(productId);
      
      if (response.success) {
        setProduct(response.product || response.data);
      } else {
        setError(response.message || 'Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refresh: fetchProduct,
  };
};

// Custom hook for featured products
export const useFeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getFeaturedProducts();
      
      if (response.success) {
        setFeaturedProducts(response.products || response.data || []);
      } else {
        setError(response.message || 'Failed to fetch featured products');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message || 'Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    featuredProducts,
    loading,
    error,
    refresh: fetchFeaturedProducts,
  };
};

// Custom hook for product search
export const useProductSearch = (initialQuery = '', initialFilters = {}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchQuery = query, searchFilters = filters) => {
    if (!searchQuery.trim() && Object.keys(searchFilters).length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await productService.searchProducts(searchQuery, searchFilters);
      
      if (response.success) {
        setResults(response.products || response.data || []);
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [query, filters]);

  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    search(newQuery, filters);
  }, [search, filters]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    search(query, newFilters);
  }, [search, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setFilters({});
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    filters,
    results,
    loading,
    error,
    search,
    updateQuery,
    updateFilters,
    clearSearch,
  };
};

export default { useProducts, useProduct, useFeaturedProducts, useProductSearch };
