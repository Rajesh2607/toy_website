import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  const orderNumber = `TOY${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card p-8">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your toys are on their way.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="font-semibold text-green-800">Order Number</p>
            <p className="text-2xl font-bold text-primary-600 font-mono">
              {orderNumber}
            </p>
          </div>

          <div className="space-y-4 text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800">What's Next?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <span>Order confirmation sent to your email</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📦</span>
                <span>Your order will be packed within 24 hours</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>🚚</span>
                <span>Free shipping (3-5 business days)</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors block text-center"
            >
              🛍️ Continue Shopping
            </Link>
            
            <Link
              to="/orders"
              className="w-full border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold py-3 px-6 rounded-lg transition-colors block text-center"
            >
              📋 View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;