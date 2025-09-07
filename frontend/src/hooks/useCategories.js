import { useState, useEffect, useCallback, useMemo } from 'react';
import { categoryService } from '../services/categoryService.js';

// Custom hook for categories with caching and optimization
export const useCategories = (options = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { 
    includeCounts = false,
    autoRefresh = false,
    refreshInterval = 600000, // 10 minutes
  } = options;

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = includeCounts 
        ? await categoryService.getCategoriesWithCounts()
        : await categoryService.getCategories();
      
      if (response.success) {
        setCategories(response.categories || response.data || []);
      } else {
        setError(response.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [includeCounts]);

  // Refresh categories
  const refresh = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchCategories();

    let interval;
    if (autoRefresh && refreshInterval > 0) {
      interval = setInterval(refresh, refreshInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchCategories, autoRefresh, refreshInterval]);

  // Memoized processed categories for better performance
  const processedCategories = useMemo(() => {
    return categories.map(category => ({
      ...category,
      displayName: category.name || category.displayName,
      slug: category.slug || category.id,
      productCount: category.productCount || 0,
    }));
  }, [categories]);

  return {
    categories: processedCategories,
    loading,
    error,
    refresh,
  };
};

// Custom hook for single category
export const useCategory = (identifier, type = 'id') => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategory = useCallback(async () => {
    if (!identifier) return;

    try {
      setLoading(true);
      setError(null);

      const response = type === 'slug' 
        ? await categoryService.getCategoryBySlug(identifier)
        : await categoryService.getCategoryById(identifier);
      
      if (response.success) {
        setCategory(response.category || response.data);
      } else {
        setError(response.message || 'Category not found');
      }
    } catch (err) {
      console.error('Error fetching category:', err);
      setError(err.message || 'Failed to fetch category');
    } finally {
      setLoading(false);
    }
  }, [identifier, type]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    category,
    loading,
    error,
    refresh: fetchCategory,
  };
};

// Custom hook for category navigation with breadcrumbs
export const useCategoryNavigation = () => {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const { categories } = useCategories();

  // Build breadcrumbs based on category hierarchy
  const buildBreadcrumbs = useCallback((categorySlug) => {
    if (!categories.length || !categorySlug) {
      setBreadcrumbs([{ name: 'All Categories', slug: 'all' }]);
      return;
    }

    const category = categories.find(cat => cat.slug === categorySlug);
    if (!category) {
      setBreadcrumbs([{ name: 'All Categories', slug: 'all' }]);
      return;
    }

    const crumbs = [
      { name: 'All Categories', slug: 'all' },
      { name: category.name, slug: category.slug }
    ];

    // Add parent categories if they exist
    if (category.parentId) {
      const parentCategory = categories.find(cat => cat.id === category.parentId);
      if (parentCategory) {
        crumbs.splice(1, 0, { 
          name: parentCategory.name, 
          slug: parentCategory.slug 
        });
      }
    }

    setBreadcrumbs(crumbs);
  }, [categories]);

  // Navigate to category
  const navigateToCategory = useCallback((categorySlug) => {
    const category = categories.find(cat => cat.slug === categorySlug) || null;
    setCurrentCategory(category);
    buildBreadcrumbs(categorySlug);
  }, [categories, buildBreadcrumbs]);

  // Get category stats
  const getCategoryStats = useMemo(() => {
    return categories.reduce((stats, category) => {
      stats[category.slug] = {
        name: category.name,
        productCount: category.productCount || 0,
        isActive: category.isActive !== false,
      };
      return stats;
    }, {});
  }, [categories]);

  return {
    categories,
    currentCategory,
    breadcrumbs,
    navigateToCategory,
    getCategoryStats,
  };
};

export default { useCategories, useCategory, useCategoryNavigation };
