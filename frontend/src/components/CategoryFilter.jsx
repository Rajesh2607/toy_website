import { memo } from 'react';

const CategoryFilter = memo(({ categories = [], selectedCategory, onCategoryChange, loading = false }) => {
  // Add default "All" category at the beginning
  const allCategories = [
    { id: 'all', name: 'All Toys', icon: '🧸', productCount: 0 },
    ...categories
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-lg bg-gray-100 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-300 rounded mb-2"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">Shop by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 hover:scale-105 relative ${
              selectedCategory === category.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title={category.description || category.name}
          >
            <span className="text-2xl mb-2">
              {category.icon || (category.id === 'all' ? '🧸' : '📦')}
            </span>
            <span className="text-sm font-medium text-center leading-tight">
              {category.name || category.displayName}
            </span>
            {category.productCount > 0 && (
              <span className={`absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-white text-primary-500'
                  : 'bg-primary-500 text-white'
              }`}>
                {category.productCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;