import React, { memo } from 'react';
import { useLazyImage } from '../hooks/useOptimization.js';

// Optimized lazy loading image component
const LazyImage = memo(({
  src,
  alt,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUwxNTAgMTc1TDE1MCA3NUw1MCA3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+',
  className = '',
  imgClassName = '',
  loadingClassName = 'animate-pulse bg-gray-200',
  errorClassName = 'bg-gray-100 text-gray-400 flex items-center justify-center text-sm',
  sizes,
  quality = 80,
  lazy = true,
  ...props
}) => {
  const { targetRef, imageSrc, isLoading, error } = useLazyImage(
    lazy ? src : src || placeholder, 
    placeholder
  );

  // Generate optimized image URL for different sizes
  const getOptimizedImageUrl = (url, width, quality = 80) => {
    if (!url || url.startsWith('data:')) return url;
    
    // For external images (Pexels, Unsplash, etc.), add optimization parameters
    if (url.includes('pexels.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&q=${quality}`;
    }
    
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?w=${width}&q=${quality}&auto=format&fit=crop`;
    }
    
    return url;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (baseUrl) => {
    if (!baseUrl || baseUrl.startsWith('data:')) return '';
    
    const breakpoints = [320, 480, 768, 1024, 1280, 1600];
    return breakpoints
      .map(width => `${getOptimizedImageUrl(baseUrl, width, quality)} ${width}w`)
      .join(', ');
  };

  // Handle error state
  if (error) {
    return (
      <div
        ref={targetRef}
        className={`${className} ${errorClassName}`}
        {...props}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <div ref={targetRef} className={className}>
      <img
        src={imageSrc}
        srcSet={lazy && imageSrc !== placeholder ? generateSrcSet(src) : undefined}
        sizes={sizes}
        alt={alt}
        className={`
          ${imgClassName}
          ${isLoading ? loadingClassName : ''}
          transition-opacity duration-300
          ${imageSrc === placeholder ? 'opacity-50' : 'opacity-100'}
        `.trim()}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        {...props}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
