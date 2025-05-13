"use client"

import { useEffect, useState } from "react"
import { FaCreditCard, FaMoneyBillWave, FaMobile } from "react-icons/fa"

const paymentOptions = [
  { label: "Cash", icon: <FaMoneyBillWave /> },
  { label: "Card", icon: <FaCreditCard /> },
  { label: "UPI", icon: <FaMobile /> },
]

const PartPaymentModal = ({ isOpen, onClose, grandTotal, onSubmit }) => {
  const [payments, setPayments] = useState([{ method: "Cash", amount: "" }])
  const [remaining, setRemaining] = useState(grandTotal)

  // Recalculate remaining amount whenever payments change
  useEffect(() => {
    const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
    setRemaining(grandTotal - totalPaid)
  }, [payments, grandTotal])

  // Handle changes to payment method or amount
  const updatePayment = (index, key, value) => {
    const updated = [...payments]
    updated[index][key] = value
    setPayments(updated)
  }

  // Add new payment method
  const addPaymentMethod = () => {
    setPayments([...payments, { method: "Cash", amount: "" }])
  }

  // Remove a payment method
  const removePaymentMethod = (index) => {
    const updated = payments.filter((_, i) => i !== index)
    setPayments(updated)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (remaining <= 0) {
      // Create a summary of part payments
      const partPaymentSummary = payments
        .filter(p => p.amount > 0) // Only include non-zero payments
        .map(p => `Paid via ${p.method} of ₹${parseFloat(p.amount).toFixed(2)}`)
        .join("\n");

      onSubmit(partPaymentSummary); // Trigger the submit callback with the part payment summary
      onClose(); // Close the modal
    } else {
      alert("Remaining amount must be zero to complete payment.")
    }
  }

  // Prevent modal from rendering if it's not open
  if (!isOpen) return null

  // Helper function to format amounts
  const formatAmount = (amount) => `₹${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-md shadow-lg relative">
        <h2 className="text-lg font-semibold mb-3 text-center">Part Payment</h2>

        {payments.map((p, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              className="border p-1 rounded w-1/3"
              value={p.method}
              onChange={(e) => updatePayment(index, "method", e.target.value)}
            >
              {paymentOptions.map((opt) => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              className="border p-1 rounded w-1/3"
              placeholder="Amount"
              value={p.amount}
              onChange={(e) => {
                const value = e.target.value;
                // Ensure the amount is a valid number
                if (value === "" || !isNaN(value)) {
                  updatePayment(index, "amount", value ? parseFloat(value) : 0);
                }
              }}
              autoFocus={index === payments.length - 1} // Focus on the last added payment input
            />
            {index > 0 && (
              <button
                className="text-red-500 font-bold text-xl"
                onClick={() => removePaymentMethod(index)}
              >
                &times;
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center text-sm mb-3">
          <span>Total: {formatAmount(grandTotal)}</span>
          <span>Remaining: {formatAmount(remaining)}</span>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-gray-300 px-4 py-1 rounded"
            onClick={addPaymentMethod}
          >
            + Add
          </button>
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={handleSubmit}
              disabled={remaining > 0} // Disable Submit if remaining > 0
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartPaymentModal
