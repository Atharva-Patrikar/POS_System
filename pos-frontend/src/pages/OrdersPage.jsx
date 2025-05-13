"use client"

import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext";

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("current")
  const [activeFilter, setActiveFilter] = useState("all") // To track active filter state
  const { cart } = useContext(CartContext);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("http://localhost:5000/api/orders")
      const data = await res.json()
      setOrders(data)
    }
    fetchOrders()
  }, [])

  const formatCurrency = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2)
    }
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2)
  }

  const handleView = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  const handleReprint = (orderId) => {
    alert(`Reprinting order with ID: ${orderId}`)
  }

  const handleCancel = (orderId) => {
    alert(`Cancelling order with ID: ${orderId}`)
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)),
    )
  }

  const getRowClass = (status) => {
    switch (status) {
      case "printed":
        return "bg-green-200"
      case "not printed":
        return "bg-yellow-200"
      case "cancelled":
        return "bg-red-200"
      default:
        return "bg-green-200"
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true
    if (activeFilter === "dine_in") return order.order_type === "dine_in"
    if (activeFilter === "delivery") return order.order_type === "delivery"
    if (activeFilter === "pickup") return order.order_type === "pickup"
    return false;
  })

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-y-hidden">
      {/* Header with tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex">
          <button
            className={`px-6 py-4 text-base font-semibold ${
              activeTab === "current" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Order
          </button>
          <button
            className={`px-6 py-4 text-base font-semibold ${
              activeTab === "online" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("online")}
          >
            Online Order
          </button>
          <button
            className={`px-6 py-4 text-base font-semibold ${
              activeTab === "advance" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("advance")}
          >
            Advance Order
          </button>
          <div className="ml-auto flex items-center">
            <button
              className="px-4 py-2 mx-2 border rounded text-red-600 hover:bg-red-50"
              onClick={() => navigate("/past-orders")}
            >
              Get Past Orders
            </button>
            <button className="px-4 py-2 mx-2 border rounded text-red-600 hover:bg-red-50" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Filter buttons + Search + Status Indicators */}
      <div className="flex border-b items-center flex-wrap">
        <div className="flex">
          {["all", "dine_in", "delivery", "pickup"].map((filter) => (
            <button
              key={filter}
              className={`flex flex-col items-center justify-center p-4 text-sm font-medium ${
                activeFilter === filter ? "border-b-2 border-red-600 text-red-600" : "text-gray-600"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              <span>
                {filter === "dine_in" ? "Dine In" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center p-4 gap-6">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border rounded-md w-64 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Printed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Not Printed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Order No.</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Order Type</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer Phone</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Customer Name</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Payment Type</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">My Amount (₹)</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Tax (₹)</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Discount (₹)</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Grand Total (₹)</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Created</th>
              <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index} className={getRowClass(order.status)}>
                <td className="py-3 px-3 text-sm text-gray-800">{order.order_number}</td>
                <td className="py-3 px-3 text-sm text-gray-800">
                  {order.order_type === "dine_in" ? (
                    <div>
                      <div>Dine In ({order.people_count || "-"})</div>
                      <div className="text-xs italic">({order.table_info || "-"})</div>
                    </div>
                  ) : (
                    order.order_type
                  )}
                </td>
                <td className="py-3 px-3 text-sm text-gray-800">{order.customer_phone || "-"}</td>
                <td className="py-3 px-3 text-sm text-gray-800">{order.customer_name || "-"}</td>
                <td className="py-3 px-3 text-sm text-gray-800">{order.payment_type || "Cash"}</td>
                <td className="py-3 px-3 text-sm text-gray-800">{formatCurrency(order.subtotal)}</td>
                <td className="py-3 px-3 text-sm text-gray-800">{formatCurrency(order.tax || 0)}</td>
                <td className="py-3 px-3 text-sm text-gray-800">({formatCurrency(order.discount || 0)})</td>
                <td className="py-3 px-3 text-sm text-gray-800">{formatCurrency(order.grand_total)}</td>
                <td className="py-3 px-3 text-sm text-gray-800">{new Date(order.created_at).toLocaleString()}</td>
                <td className="py-3 px-3">
                  <div className="flex space-x-2 text-sm text-blue-600">
                    <button className="underline hover:text-blue-800 font-medium" onClick={() => handleView(order.id)}>
                      View
                    </button>
                    <span>|</span>
                    <button className="underline hover:text-blue-800 font-medium" onClick={() => handleReprint(order.id)}>
                      Reprint
                    </button>
                    {order.status !== "cancelled" && (
                      <>
                        <span>|</span>
                        <button className="underline hover:text-blue-800 font-medium" onClick={() => handleCancel(order.id)}>
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersPage
