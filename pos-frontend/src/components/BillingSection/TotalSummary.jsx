const TotalSummary = ({ totalPrice, taxAmount, appliedDiscount, onDiscountClick }) => {
  return (
    <div className="text-sm text-gray-800 space-y-2 mb-4">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>₹{totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax (5%)</span>
        <span>₹{taxAmount.toFixed(2)}</span>
      </div>
      <div
        className="flex justify-between cursor-pointer text-blue-600 hover:underline"
        onClick={onDiscountClick}
      >
        <span>Discount</span>
        <span>- ₹{appliedDiscount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold border-t pt-2">
        <span>Grand Total</span>
        <span>₹{(totalPrice + taxAmount - appliedDiscount).toFixed(2)}</span>
      </div>
    </div>
  )
}

export default TotalSummary
