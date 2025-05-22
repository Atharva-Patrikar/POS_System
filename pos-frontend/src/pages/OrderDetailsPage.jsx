"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const OrderDetailsPage = () => {
  const [orderDetails, setOrderDetails] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        // Use the correct API endpoint
        const response = await fetch(`http://localhost:5000/api/orders/${id}`)

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const data = await response.json()

        if (data.order) {
          setOrderDetails(data.order)
          setOrderItems(data.items || [])
        } else {
          setError("Order not found")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error.message || "Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  const formatCurrency = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2)
    }
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">Order not found</h2>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-medium">Order Detail</h1>
        <button
          className="px-4 py-2 border rounded flex items-center text-red-600 hover:bg-red-50"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Order Information */}
      <div className="overflow-auto">
        {/* Order Details Table */}
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Order No.
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Billing User
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Customer Name
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Customer Phone
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Customer Address
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Customer Locality
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                No. of Persons
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Order Type
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Payment Type
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Total Tax
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Total Discount
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Grand Total
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Settlement Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-3 border">{orderDetails.order_number}</td>
              <td className="py-3 px-3 border">biller</td>
              <td className="py-3 px-3 border">{orderDetails.customer_name || "-"}</td>
              <td className="py-3 px-3 border">{orderDetails.customer_phone || "-"}</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">{orderDetails.people_count || "-"}</td>
              <td className="py-3 px-3 border">
                {orderDetails.order_type === "dine_in"
                  ? `Dine In (${orderDetails.people_count || "-"})`
                  : orderDetails.order_type}
              </td>
              <td className="py-3 px-3 border">{orderDetails.payment_type || "Cash"}</td>
              <td className="py-3 px-3 border">{formatCurrency(orderDetails.tax || 0)}</td>
              <td className="py-3 px-3 border">({formatCurrency(orderDetails.discount || 0)})</td>
              <td className="py-3 px-3 border">{formatCurrency(orderDetails.grand_total)}</td>
              <td className="py-3 px-3 border">-</td>
            </tr>
          </tbody>
        </table>

        <table className="min-w-full border-collapse mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Printed
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                KOT
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Coupon
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Customer Id
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Tip
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Sub Order Type
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Settlement
              </th>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                Sequence Name
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-3 border">{orderDetails.status === "printed" ? "Yes (1 time(s))" : "-"}</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">-</td>
              <td className="py-3 px-3 border">{orderDetails.table_info || "COUNTER"}</td>
              <td className="py-3 px-3 border">
                <div>
                  <div>Counter : main</div>
                  <div>By : biller</div>
                  <div>(biller)</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Order Items</h2>
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Item Name
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Special Note
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Quantity
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Unit Price
                </th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-3 border">{item.dish_name}</td>
                    <td className="py-3 px-3 border">--</td>
                    <td className="py-3 px-3 border">{item.quantity}</td>
                    <td className="py-3 px-3 border">{formatCurrency(item.price)}</td>
                    <td className="py-3 px-3 border">{formatCurrency(item.total_price)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-3 border text-center">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage
