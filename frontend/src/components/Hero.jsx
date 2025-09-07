import { Link } from 'react-router-dom';
import { memo, useState, useEffect } from 'react';
import LazyImage from './LazyImage';
import { formatPrice } from '../utils/currency';

const Hero = memo(({ featuredProducts = [], loading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get the first 3 featured products for the hero carousel
  const heroProducts = featuredProducts.slice(0, 3);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && heroProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, heroProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // If loading or no featured products, show default hero
  if (loading || heroProducts.length === 0) {
    return (
      <div className="bg-gradient-to-r from-primary-400 via-accent-pink to-accent-purple py-16 px-4 mb-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-kid">
            Welcome to ToyLand! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Discover amazing toys that spark imagination and bring joy to every child's day!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="#products"
              className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              🛍️ Shop Now
            </Link>
            <Link
              to="/categories"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105"
            >
              🔍 Browse Categories
            </Link>
          </div>

          {/* Floating Icons */}
          <div className="mt-12 grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-2xl mx-auto">
            {['🚀', '🎨', '🧩', '🚗', '🎭', '🎪', '🎯', '🎮'].map((icon, index) => (
              <div
                key={index}
                className="text-3xl animate-bounce-slow opacity-70"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-primary-400 via-accent-pink to-accent-purple py-16 px-4 mb-8 overflow-hidden">
      {/* Hero Carousel */}
      <div className="container mx-auto">
        <div className="relative">
          {/* Slides */}
          <div className="flex transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {heroProducts.map((product, index) => (
              <div key={product.id} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[400px]">
                  {/* Product Info */}
                  <div className="text-center lg:text-left text-white">
                    <div className="inline-block bg-white text-primary-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                      ⭐ Featured Product
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-kid">
                      {product.name}
                    </h1>
                    <p className="text-lg md:text-xl mb-6 opacity-90">
                      {product.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-2xl md:text-3xl font-bold">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg md:text-xl ml-2 line-through opacity-60">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center justify-center lg:justify-start mb-6">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-yellow-300 ${
                                i < Math.floor(product.rating) ? 'opacity-100' : 'opacity-30'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm opacity-80">
                          {product.rating} ({product.reviewCount || product.reviews} reviews)
                        </span>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        🛍️ View Product
                      </Link>
                      <Link
                        to="/categories"
                        className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-full transition-all duration-200 hover:scale-105"
                      >
                        🔍 Browse More
                      </Link>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="order-first lg:order-last">
                    <div className="relative group">
                      <LazyImage
                        src={product.image}
                        alt={product.name}
                        className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                        imgClassName="w-full h-80 object-cover rounded-2xl"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={90}
                        lazy={false}
                      />
                      
                      {/* Discount Badge */}
                      {product.originalPrice && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold text-lg">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {heroProducts.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {heroProducts.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {heroProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index
                      ? 'bg-white scale-125'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Icons */}
        <div className="mt-12 grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-2xl mx-auto">
          {['🚀', '🎨', '🧩', '🚗', '🎭', '🎪', '🎯', '🎮'].map((icon, index) => (
            <div
              key={index}
              className="text-3xl animate-bounce-slow opacity-70"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;