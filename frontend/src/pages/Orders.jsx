import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
      setOrders(savedOrders);
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Please Login</h1>
        <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
        <Link to="/login" className="btn-primary">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-primary-100 mt-2">Track and manage your order history</p>
          </div>
          <div className="text-6xl">📦</div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">You haven't placed any orders. Start shopping to see your order history here.</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      <span>{getStatusIcon(order.status)}</span>
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 font-medium"
                      >
                        View Details
                      </button>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium">
                          Rate & Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-4 overflow-x-auto">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">#{selectedOrder.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      <span>{getStatusIcon(selectedOrder.status)}</span>
                      <span className="capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-primary-600">
                      {formatPrice(selectedOrder.total)}
                    </p>
                  </div>

                  {selectedOrder.items && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Items Ordered</p>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedOrder.trackingNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Tracking Number</p>
                      <p className="font-medium text-primary-600">
                        {selectedOrder.trackingNumber}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 font-medium">
                      Track Package
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6 sticky top-24 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h3>
                <p className="text-gray-600 text-sm">Select an order to view detailed information</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Demo Orders Button - For testing purposes */}
      {orders.length === 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const demoOrders = [
                {
                  id: 'ORD001',
                  date: new Date().toISOString(),
                  status: 'delivered',
                  total: 2499,
                  items: [
                    {
                      id: 1,
                      name: 'Educational Building Blocks Set',
                      price: 2499,
                      quantity: 1,
                      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'
                    }
                  ],
                  trackingNumber: 'TRK123456789'
                },
                {
                  id: 'ORD002',
                  date: new Date(Date.now() - 86400000 * 3).toISOString(),
                  status: 'shipped',
                  total: 4149,
                  items: [
                    {
                      id: 2,
                      name: 'Remote Control Racing Car',
                      price: 4149,
                      quantity: 1,
                      image: 'https://images.unsplash.com/photo-1558618666-fbd6c1d12d58?w=400'
                    }
                  ],
                  trackingNumber: 'TRK987654321'
                }
              ];
              localStorage.setItem(`orders_${user.email}`, JSON.stringify(demoOrders));
              setOrders(demoOrders);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium text-sm"
          >
            Add Demo Orders (For Testing)
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
