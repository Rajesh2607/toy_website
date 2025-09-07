export const showToast = (message, type = 'info', duration = 4000) => {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  // Create new toast
  const toast = document.createElement('div');
  toast.className = `toast-notification fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-[9999] max-w-sm transform transition-all duration-300 translate-x-full`;
  
  // Set styles based on type
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };
  
  toast.className += ` ${styles[type] || styles.info}`;
  
  // Add content
  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <span class="text-sm">${message}</span>
      <button class="ml-3 text-white hover:text-gray-200 font-bold text-lg" onclick="this.parentElement.parentElement.remove()">
        ×
      </button>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.transform = 'translateX(full)';
        setTimeout(() => {
          if (toast.parentElement) {
            toast.remove();
          }
        }, 300);
      }
    }, duration);
  }
};

export const showLoginRequired = (action, productName = '') => {
  const message = productName 
    ? `Please login to ${action} "${productName}"`
    : `Please login to ${action}`;
    
  return new Promise((resolve) => {
    const proceed = window.confirm(`${message}\n\nWould you like to login now?`);
    resolve(proceed);
  });
};
