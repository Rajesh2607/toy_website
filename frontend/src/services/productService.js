import { apiService } from './api.js';

// Product service with caching
class ProductService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Check if cache entry is valid
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTTL;
  }

  // Get from cache or fetch
  async getCachedOrFetch(key, fetchFn) {
    if (this.isCacheValid(key)) {
      return this.cache.get(key).data;
    }
    
    const data = await fetchFn();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  // Get all products with optional filters
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const cacheKey = `products_${queryString}`;

    return this.getCachedOrFetch(cacheKey, () => apiService.get(endpoint));
  }

  // Get featured products
  async getFeaturedProducts() {
    return this.getCachedOrFetch('featured_products', () => 
      apiService.get('/products?featured=true&limit=8')
    );
  }

  // Get product by ID
  async getProductById(id) {
    const cacheKey = `product_${id}`;
    return this.getCachedOrFetch(cacheKey, () => apiService.get(`/products/${id}`));
  }

  // Search products
  async searchProducts(query, filters = {}) {
    const params = { search: query, ...filters };
    return this.getProducts(params);
  }

  // Get products by category
  async getProductsByCategory(categorySlug, filters = {}) {
    const params = { category: categorySlug, ...filters };
    return this.getProducts(params);
  }

  // Get related products
  async getRelatedProducts(productId, categorySlug, limit = 4) {
    const cacheKey = `related_${productId}`;
    return this.getCachedOrFetch(cacheKey, () => 
      apiService.get(`/products/related/${productId}?category=${categorySlug}&limit=${limit}`)
    );
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(key) {
    this.cache.delete(key);
  }
}

export const productService = new ProductService();
export default productService;
