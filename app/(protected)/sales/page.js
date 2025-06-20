"use client";
// pages/sales/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiPrinter, FiDownload, FiPlus } from "react-icons/fi";

export default function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchSales = async () => {
      setIsLoading(true);
      // Mock data
      const mockSales = [
        {
          invoiceNo: "INV-2023-001",
          customer: "Acme Corp",
          date: "2023-11-15",
          amount: 1250.75,
          status: "completed",
          items: 5,
          paymentMethod: "Credit Card",
        },
        {
          invoiceNo: "INV-2023-002",
          customer: "Globex Inc",
          date: "2023-11-15",
          amount: 845.5,
          status: "completed",
          items: 3,
          paymentMethod: "Bank Transfer",
        },
        {
          invoiceNo: "INV-2023-003",
          customer: "Initech LLC",
          date: "2023-11-16",
          amount: 3200.0,
          status: "pending",
          items: 12,
          paymentMethod: "Credit Term",
        },
        {
          invoiceNo: "INV-2023-004",
          customer: "Umbrella Corp",
          date: "2023-11-16",
          amount: 675.25,
          status: "completed",
          items: 4,
          paymentMethod: "Cash",
        },
        {
          invoiceNo: "INV-2023-005",
          customer: "Wayne Enterprises",
          date: "2023-11-17",
          amount: 2100.0,
          status: "refunded",
          items: 7,
          paymentMethod: "Credit Card",
        },
      ];
      setSales(mockSales);
      setIsLoading(false);
    };

    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    // Apply status filter
    if (filter !== "all" && sale.status !== filter) return false;

    const filteredSales = sales.filter((sale) => {
      // Status filter
      const statusMatch = filter === "all" || sale.status === filter;

      // Search filter
      const searchMatch =
        !searchQuery ||
        sale.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && searchMatch;
    });
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "refunded":
        return "Refunded";
      case "cancelled":
        return "Cancelled";
      default:
        return "Completed";
    }
  };

  const getTotalSales = () => {
    return sales
      .filter((sale) => sale.status === "completed")
      .reduce((sum, sale) => sum + sale.amount, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sales Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold">${getTotalSales()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Today's Sales</h3>
          <p className="text-2xl font-bold">$1,845.50</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">3</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Avg. Order Value</h3>
          <p className="text-2xl font-bold">$1,578.30</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="filter-all"
                name="filter"
                checked={filter === "all"}
                onChange={() => setFilter("all")}
                className="mr-2"
              />
              <label htmlFor="filter-all">All</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="filter-completed"
                name="filter"
                checked={filter === "completed"}
                onChange={() => setFilter("completed")}
                className="mr-2"
              />
              <label htmlFor="filter-completed">Completed</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="filter-pending"
                name="filter"
                checked={filter === "pending"}
                onChange={() => setFilter("pending")}
                className="mr-2"
              />
              <label htmlFor="filter-pending">Pending</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="filter-refunded"
                name="filter"
                checked={filter === "refunded"}
                onChange={() => setFilter("refunded")}
                className="mr-2"
              />
              <label htmlFor="filter-refunded">Refunded</label>
            </div>
          </div>

          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices or customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="border rounded px-3 py-2"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <FiPlus className="mr-2" />
            New Sale
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">Loading sales data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.invoiceNo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <Link
                        href={`/sales/${sale.invoiceNo}`}
                        className="text-blue-600 hover:underline"
                      >
                        {sale.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${sale.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {getStatusText(sale.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FiPrinter />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <FiDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats and Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Sales Trend Chart */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h3 className="text-lg font-medium mb-4">
            Sales Trend (Last 7 Days)
          </h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            [Sales Chart Placeholder]
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Credit Card</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Bank Transfer</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Cash</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-600 h-2.5 rounded-full"
                  style={{ width: "15%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Credit Term</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-medium mb-4">Recent Sales Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiPlus />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">New sale created</p>
              <p className="text-sm text-gray-500">
                Invoice INV-2023-006 for $1,250.00
              </p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              ✓
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Payment received</p>
              <p className="text-sm text-gray-500">$845.50 for INV-2023-002</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              !
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Pending approval</p>
              <p className="text-sm text-gray-500">
                Credit term request for $3,200.00
              </p>
              <p className="text-xs text-gray-400">3 hours ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to {filteredSales.length} of {sales.length} entries
        </div>
        <div className="space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded-md">Previous</button>
          <button className="bg-gray-200 px-4 py-2 rounded-md">Next</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}
