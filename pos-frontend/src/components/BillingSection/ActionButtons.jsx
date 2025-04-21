"use client"

import { FaSave, FaPrint, FaFileInvoice, FaPause } from "react-icons/fa"
import generateBillPdf from "../../utils/generateBillPdf"

const ActionButtons = ({ 
  cart, 
  grandTotal, 
  paymentMethod, 
  setPdfUrl, 
  pdfUrl, 
  tableNumber, 
  peopleCount, 
  customerDetails,
  orderType,
}) => {

  // 🔹 Print Only (new logic)
  const handlePrintOnly = async () => {
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
      const tax = 0
      const discount = 0

      const customerData = {
        name: customerDetails?.name || "",
        phone: customerDetails?.phone || "",
        address: customerDetails?.address || "",
      }

      // Generate PDF without saving the order
      generateBillPdf(cart, grandTotal, paymentMethod, orderType, setPdfUrl)

      // Optionally, you can trigger the print dialogue here, depending on your use case.
      if (pdfUrl) {
        const iframe = document.createElement("iframe")
        iframe.src = pdfUrl
        iframe.style.display = "none"
        document.body.appendChild(iframe)
        iframe.contentWindow.print()
      }
    } catch (err) {
      console.error("Error printing the bill:", err)
      alert("Something went wrong while printing the bill.")
    }
  }

  // 🔹 Save only (new logic)
  const handleSaveOnly = async () => {
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
      const tax = 0
      const discount = 0

      const customerData = {
        name: customerDetails?.name || "",
        phone: customerDetails?.phone || "",
        address: customerDetails?.address || "",
      }

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_type: orderType,
          table_info: tableNumber,
          people_count: peopleCount,
          customer: customerData,
          payment_type: paymentMethod,
          subtotal,
          tax,
          discount,
          grand_total: grandTotal,
          items: cart,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("Order saved successfully.")
      } else {
        alert("Failed to save order.")
      }
    } catch (err) {
      console.error("Error saving order:", err)
      alert("Something went wrong while saving the order.")
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      {/* Save Button */}
      <button
        onClick={handleSaveOnly}
        className="flex items-center justify-center bg-black text-white py-1 px-2 rounded-md hover:bg-gray-800"
      >
        <FaSave className="mr-1" />
        Save
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrintOnly}
        className="flex items-center justify-center bg-black text-white py-1 px-2 rounded-md hover:bg-gray-800"
      >
        <FaPrint className="mr-1" />
        Print
      </button>

      {/* eBill Button */}
      <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-1 px-2 rounded-md hover:bg-gray-300">
        <FaFileInvoice className="mr-1" />
        eBill
      </button>

      {/* Hold Button */}
      <button className="flex items-center justify-center bg-gray-200 text-gray-800 py-1 px-2 rounded-md hover:bg-gray-300">
        <FaPause className="mr-1" />
        Hold
      </button>

      {/* PDF Download */}
      {pdfUrl && (
        <div className="col-span-2 mt-2">
          <a href={pdfUrl} download="Bill.pdf" className="block">
            <button className="flex items-center justify-center bg-green-600 text-white py-1.5 px-3 text-xs rounded-md hover:bg-green-700 w-full">
              <FaFileInvoice className="mr-1" />
              Download PDF
            </button>
          </a>
        </div>
      )}
    </div>
  )  
}

export default ActionButtons
