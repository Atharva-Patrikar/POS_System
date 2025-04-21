import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();  // Initialize navigate function

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
  };

  const handleView = (orderId) => {
    navigate(`/orders/${orderId}`); // Navigate to the order details page
  };

  const handleReprint = (orderId) => {
    // Call API or perform action to reprint the bill
    alert(`Reprinting order with ID: ${orderId}`);
    // After reprinting, you might want to update the order status to "printed"
  };

  const handleCancel = (orderId) => {
    // Call API or perform action to cancel the order
    alert(`Cancelling order with ID: ${orderId}`);
    // After canceling, update the order status in state (optional, depending on backend)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  const getRowClass = (status) => {
    switch (status) {
      case "printed":
        return "bg-green-100"; // Green for printed
      case "not printed":
        return "bg-yellow-100"; // Yellow for not printed
      case "cancelled":
        return "bg-red-100"; // Red for cancelled
      default:
        return ""; // Default (no status)
    }
  };

  return (
    <div className="flex flex-col p-4 w-full h-full overflow-hidden">
      {/* Color indication above table */}
      <div className="flex justify-end text-sm mb-4">
        <span className="text-green-500 mr-4">Printed - Green</span>
        <span className="text-yellow-500 mr-4">Not Printed - Yellow</span>
        <span className="text-red-500">Cancelled - Red</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div className="flex gap-3 text-sm font-semibold">
          <button className="text-primary border-b-2 border-primary pb-1">
            Current Order
          </button>
          <button className="text-gray-500 hover:text-primary">Online Order</button>
          <button className="text-gray-500 hover:text-primary">Advance Order</button>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border rounded text-sm">All</button>
          <button className="px-3 py-1.5 border rounded text-sm">Dine In</button>
          <button className="px-3 py-1.5 border rounded text-sm">Delivery</button>
          <button className="px-3 py-1.5 border rounded text-sm">Pick Up</button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-1 rounded text-sm w-full md:w-64"
        />
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-2 py-2">Order No</th>
              <th>Order Type</th>
              <th>Table</th>
              <th>People</th>
              <th>Phone</th>
              <th>Name</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Discount</th>
              <th>Grand Total</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className={`${getRowClass(order.status)} border-t`}>
                <td className="px-2 py-2 text-center">{order.order_number}</td>
                <td>{order.order_type || "-"}</td>
                <td>{order.table_info || "-"}</td>
                <td>{order.people_count || "-"}</td>
                <td>{order.customer_phone || "-"}</td>
                <td>{order.customer_name || "-"}</td>
                <td>{order.payment_type || "-"}</td>
                <td>{formatCurrency(order.subtotal)}</td>
                <td>({formatCurrency(order.discount)})</td>
                <td>{formatCurrency(order.grand_total)}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td className="space-x-2 text-blue-600 underline cursor-pointer">
                  <span onClick={() => handleView(order.id)}>View</span>
                  <span onClick={() => handleReprint(order.id)}>Reprint</span>
                  <span onClick={() => handleCancel(order.id)}>Cancel</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
