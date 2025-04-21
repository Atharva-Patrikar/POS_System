"use client"

import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa"

const SelectedItems = ({ cart, removeFromCart, updateQuantity, addToCart, removeItem }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {cart.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center py-3 px-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">₹{item.price} each</p>
              </div>

              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaMinus className="text-xs" />
                </button>

                <input
                  type="text"
                  className="w-10 h-8 mx-1 text-center text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                  value={item.qty}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                />

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={() => addToCart(item)}
                >
                  <FaPlus className="text-xs" />
                </button>

                <button
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                  onClick={() => removeItem(item.id)}
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="bg-gray-100 rounded-full p-4 mb-3">
            <FaShoppingCart className="text-gray-400 text-xl" />
          </div>
          <div className="text-lg text-gray-500 font-medium mb-1">Your cart is empty</div>
          <div className="text-sm text-gray-400">Add items from the menu to get started</div>
        </div>
      )}
    </div>
  )
}

export default SelectedItems
