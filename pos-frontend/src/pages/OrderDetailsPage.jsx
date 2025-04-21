import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetailsPage = () => {
  const { orderId } = useParams();  // To get the order ID from the URL
  const history = useHistory();
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await res.json();
        setOrderDetails(data);
      } catch (err) {
        setError("Failed to fetch order details");
        console.error(err);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error) return <div>{error}</div>;

  if (!orderDetails) return <div>Loading...</div>;

  const { order, items } = orderDetails;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => history.push("/orders")} // Navigate back to the orders list
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Orders
        </button>
        <h1 className="text-xl font-bold">Order Details</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 mb-4 border rounded">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <table className="w-full mt-2">
          <tbody>
            <tr>
              <td className="font-medium">Order No:</td>
              <td>{order.order_number}</td>
            </tr>
            <tr>
              <td className="font-medium">Customer Name:</td>
              <td>{order.customer_name}</td>
            </tr>
            <tr>
              <td className="font-medium">Phone:</td>
              <td>{order.customer_phone}</td>
            </tr>
            <tr>
              <td className="font-medium">Payment Type:</td>
              <td>{order.payment_type}</td>
            </tr>
            <tr>
              <td className="font-medium">Order Type:</td>
              <td>{order.order_type}</td>
            </tr>
            <tr>
              <td className="font-medium">Table:</td>
              <td>{order.table_info}</td>
            </tr>
            <tr>
              <td className="font-medium">People Count:</td>
              <td>{order.people_count}</td>
            </tr>
            <tr>
              <td className="font-medium">Subtotal:</td>
              <td>{order.subtotal}</td>
            </tr>
            <tr>
              <td className="font-medium">Tax:</td>
              <td>{order.tax}</td>
            </tr>
            <tr>
              <td className="font-medium">Discount:</td>
              <td>{order.discount}</td>
            </tr>
            <tr>
              <td className="font-medium">Grand Total:</td>
              <td>{order.grand_total}</td>
            </tr>
            <tr>
              <td className="font-medium">Created At:</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="font-medium">Status:</td>
              <td>{order.status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Order Items */}
      <div className="bg-white p-4 mb-4 border rounded">
        <h2 className="text-lg font-semibold">Order Items</h2>
        <table className="w-full mt-2">
          <thead>
            <tr>
              <th className="text-left">Dish Name</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Net Price</th>
              <th className="text-left">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.dish_name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
