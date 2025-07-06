'use client';

import { useState, useEffect } from 'react';
import { FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock products
      const mockProducts = [
        { id: '1', name: 'Premium Widget', stock: 42, price: 29.99, category: 'Widgets' },
        { id: '2', name: 'Basic Gadget', stock: 125, price: 12.50, category: 'Gadgets' },
        { id: '3', name: 'Deluxe Gizmo', stock: 8, price: 59.99, category: 'Gizmos' },
        { id: '4', name: 'Standard Thingy', stock: 76, price: 9.99, category: 'Thingies' },
      ];
      
      // Mock orders
      const mockOrders = [
        { id: '1001', customer: 'Acme Corp', status: 'completed', total: 299.90, date: '2023-05-15' },
        { id: '1002', customer: 'Globex Inc', status: 'processing', total: 450.25, date: '2023-05-16' },
        { id: '1003', customer: 'Initech', status: 'pending', total: 125.75, date: '2023-05-17' },
        { id: '1004', customer: 'Umbrella Corp', status: 'pending', total: 89.99, date: '2023-05-17' },
      ];
      
      // Mock sales data
      const mockSalesData = [
        { day: 'Mon', sales: 12 },
        { day: 'Tue', sales: 19 },
        { day: 'Wed', sales: 8 },
        { day: 'Thu', sales: 15 },
        { day: 'Fri', sales: 22 },
        { day: 'Sat', sales: 10 },
        { day: 'Sun', sales: 5 },
      ];
      
      // Mock inventory alerts
      const mockAlerts = mockProducts
        .filter(p => p.stock < 10)
        .map(p => ({
          id: p.id,
          productName: p.name,
          currentStock: p.stock,
          threshold: 10
        }));
      
      setProducts(mockProducts);
      setOrders(mockOrders);
      setSalesData(mockSalesData);
      setAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate dashboard metrics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-semibold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Dashboard Overview */}
      {activeTab === 'overview' && (
        <div className="px-4 sm:px-0">
          {/* Metrics Cards - Stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard 
              icon={<FiPackage className="h-6 w-6" />}
              title="Total Products"
              value={totalProducts}
              change="+5% from last month"
            />
            <MetricCard 
              icon={<FiDollarSign className="h-6 w-6" />}
              title="Inventory Value"
              value={`$${totalInventoryValue.toLocaleString()}`}
              change="+12% from last month"
            />
            <MetricCard 
              icon={<FiShoppingCart className="h-6 w-6" />}
              title="Pending Orders"
              value={pendingOrders}
              change={pendingOrders > 0 ? `${pendingOrders} needs attention` : "All clear"}
            />
            <MetricCard 
              icon={<FiTrendingUp className="h-6 w-6" />}
              title="Total Sales"
              value={`$${totalSales.toLocaleString()}`}
              change="+8% from last month"
            />
          </div>

          {/* Alerts - Simplified table on mobile */}
          {alerts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-3 flex items-center">
                <FiAlertCircle className="text-yellow-500 mr-2" />
                Inventory Alerts
              </h2>
              <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                      <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.map(alert => (
                      <tr key={alert.id}>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.productName}</td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">{alert.currentStock}</td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.threshold}</td>
                        <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Orders - Scrollable on mobile */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-3">Recent Orders</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id}>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Weekly Sales</h2>
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">Sales chart visualization would appear here</p>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg font-medium">Product Inventory</h2>
            <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Product
            </button>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(product.price * product.stock).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="px-4 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg font-medium">Order Management</h2>
            <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Create Order
            </button>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="px-4 sm:px-0">
          <h2 className="text-lg font-medium mb-6">Reports & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-md font-medium mb-4">Sales Overview</h3>
              <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Sales chart visualization would appear here</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-md font-medium mb-4">Inventory Status</h3>
              <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Inventory chart would appear here</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-md font-medium mb-4">Export Data</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Export Sales Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Export Inventory Report
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Export Customer Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component - Responsive
function MetricCard({ icon, title, value, change }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4 sm:p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-4 sm:ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 sm:px-5 py-3">
        <div className="text-sm">
          <span className={`font-medium ${
            change.includes('+') ? 'text-green-600' : 
            change.includes('needs attention') ? 'text-yellow-600' :
            'text-gray-500'
          }`}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;

// 'use client';

// import ProtectedRoute from '../components/ProtectedRoute';
// import { useAuth } from '../providers/AuthProvider';

// function DashboardPage() {
//   const { user, signOut } = useAuth();

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gray-100">
//         <nav className="bg-white shadow">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between h-16 items-center">
//               <div className="flex">
//                 <div className="flex-shrink-0 flex items-center">
//                   <h1 className="text-xl font-bold">Dashboard</h1>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <span className="mr-4">Welcome, {user?.name}</span>
//                 <button
//                   onClick={signOut}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             </div>
//           </div>
//         </nav>

//         <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <div className="px-4 py-6 sm:px-0">
//             <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
//               <h2 className="text-lg font-medium">Your Dashboard Content</h2>
//               <p className="mt-2 text-gray-600">
//                 This is a protected page. Only authenticated users can see this content.
//               </p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }

// export default DashboardPage;