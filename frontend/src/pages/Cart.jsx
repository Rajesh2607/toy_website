import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <span className="text-8xl block mb-6">🛒</span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any toys to your cart yet.
          </p>
          <Link
            to="/"
            className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
          >
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.color}`} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-grow space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    {item.color && (
                      <p className="text-sm text-gray-600 capitalize">
                        Color: {item.color}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">Qty:</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <span className="text-xl font-bold text-primary-600">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id, item.color)}
                        className="text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-xl mb-6 text-gray-800">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-green-600">
                  {getTotalPrice() >= 2000 ? 'FREE' : formatPrice(199)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold">{formatPrice(getTotalPrice() * 0.18)}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary-600">
                  {formatPrice(getTotalPrice() + (getTotalPrice() >= 2000 ? 0 : 199) + (getTotalPrice() * 0.18))}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition-colors mt-6 block text-center"
            >
              🎉 Proceed to Checkout
            </Link>
          </div>

          {/* Shipping Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-green-500 text-xl">🚚</span>
              <div>
                <p className="font-semibold text-green-800">
                  {getTotalPrice() >= 2000 ? 'FREE Shipping!' : 'Almost there!'}
                </p>
                <p className="text-sm text-green-700">
                  {getTotalPrice() >= 2000 
                    ? 'You qualify for free shipping on this order.'
                    : `Add ${formatPrice(2000 - getTotalPrice())} more for free shipping.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <Link
            to="/"
            className="w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold py-4 px-6 rounded-lg transition-colors block text-center"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;