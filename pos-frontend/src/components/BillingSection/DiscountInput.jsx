"use client"

import { useState } from "react"

const DiscountInput = ({
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  handleApplyDiscount,
  appliedDiscount,
  setShowDiscountOverlay,
  showDiscountOverlay,
}) => {
  const handleDone = () => {
    handleApplyDiscount(discountValue) // Pass only the discountValue to the backend
    setShowDiscountOverlay(false)
  }

  const handleRemoveDiscount = () => {
    setDiscountValue(0)
    setShowDiscountOverlay(false)
    handleApplyDiscount(0) // Send 0 to the backend when discount is removed
  }

  return (
    <>
      {showDiscountOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-sm space-y-4 relative shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Apply Discount</h3>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={discountType === "percentage"}
                  onChange={() => setDiscountType("percentage")}
                />
                <span>% Percentage</span>
              </label>
              <label className="flex items-center space-x-1 text-sm">
                <input
                  type="radio"
                  name="discountType"
                  value="amount"
                  checked={discountType === "amount"}
                  onChange={() => setDiscountType("amount")}
                />
                <span>₹ Amount</span>
              </label>
            </div>

            <input
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder={`Enter discount ${discountType === "percentage" ? "(%)" : "(₹)"}`}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />

            <div className="flex justify-between items-center mt-4 space-x-2">
              <button
                className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200"
                onClick={handleRemoveDiscount}
              >
                Remove Discount
              </button>
              <div className="flex space-x-2">
                <button
                  className="px-4 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => setShowDiscountOverlay(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={handleDone}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DiscountInput