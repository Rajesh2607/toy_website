// Currency utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Convert USD prices to INR (approximate conversion rate)
export const usdToInr = (usdAmount) => {
  const conversionRate = 83; // 1 USD = 83 INR (approximate)
  return Math.round(usdAmount * conversionRate);
};

// Format price with rupee symbol
export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};
