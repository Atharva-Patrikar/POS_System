const TotalSummary = ({ grandTotal, onDiscountClick }) => {
  return (
    <div className="text-sm text-gray-800 space-y-2 mb-4">
      <div className="flex justify-between items-center">
        <button
          onClick={onDiscountClick}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
        >
          Discount
        </button>
        <div className="font-semibold text-sm">
          <span className="text-xs">Grand Total:</span>{" "}
          <span className="text-xl text-[#FFD700] font-bold">₹{(grandTotal ?? 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default TotalSummary
