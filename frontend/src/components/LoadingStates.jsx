import React from 'react';

// Loading spinner component
export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
};

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="bg-gray-300 h-48 rounded-t-lg"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Category card skeleton
export const CategoryCardSkeleton = () => (
  <div className="p-6 rounded-xl bg-white border animate-pulse">
    <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
    <div className="h-4 bg-gray-300 rounded mb-2 mx-auto w-20"></div>
    <div className="h-3 bg-gray-300 rounded mx-auto w-16"></div>
  </div>
);

// Full page loading
export const PageLoading = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Error boundary component
export const ErrorBoundary = ({ error, onRetry, children }) => {
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-lg font-semibold">Oops! Something went wrong</p>
          <p className="text-sm text-gray-600 mt-2">{error.message || error}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            Try Again
          </button>
        )}
      </div>
    );
  }

  return children;
};

// Empty state component
export const EmptyState = ({ 
  icon = "📦", 
  title = "No items found", 
  description = "There are no items to display.",
  actionLabel,
  onAction 
}) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6">{description}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="btn-primary">
        {actionLabel}
      </button>
    )}
  </div>
);

// Grid loading component
export const GridLoading = ({ count = 8, Component = ProductCardSkeleton }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <Component key={index} />
    ))}
  </div>
);

export default {
  LoadingSpinner,
  ProductCardSkeleton,
  CategoryCardSkeleton,
  PageLoading,
  ErrorBoundary,
  EmptyState,
  GridLoading,
};
