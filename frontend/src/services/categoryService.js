import { apiService } from './api.js';

// Category service with caching
class CategoryService {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 10 * 60 * 1000; // 10 minutes (categories change less frequently)
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

  // Get all categories
  async getCategories() {
    return this.getCachedOrFetch('categories', () => apiService.get('/categories'));
  }

  // Get category by ID
  async getCategoryById(id) {
    const cacheKey = `category_${id}`;
    return this.getCachedOrFetch(cacheKey, () => apiService.get(`/categories/${id}`));
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    const cacheKey = `category_slug_${slug}`;
    return this.getCachedOrFetch(cacheKey, () => apiService.get(`/categories/slug/${slug}`));
  }

  // Get categories with product counts
  async getCategoriesWithCounts() {
    return this.getCachedOrFetch('categories_with_counts', () => 
      apiService.get('/categories?includeCounts=true')
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

export const categoryService = new CategoryService();
export default categoryService;
