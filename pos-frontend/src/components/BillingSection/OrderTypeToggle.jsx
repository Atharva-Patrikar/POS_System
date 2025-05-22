"use client"

import {
  UserRound,
  Users,
  StickyNote,
  ConciergeBell,
  FilePenLine,
  CheckCircle,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import debounce from "lodash.debounce"

const OrderTypeToggle = ({
  showCustomerForm,
  setShowCustomerForm,
  customerName,
  setCustomerName,
  customerMobile,
  setCustomerMobile,
  customerAddress,
  setCustomerAddress,
  handleSaveCustomer,
  peopleCount,
  setPeopleCount,
  showPeopleInput,
  setShowPeopleInput,
  setShowCartView,
  partPaymentDetails,
  setShowPartModal,
}) => {
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [orderNumber, setOrderNumber] = useState(null)
  const [showPartSummaryModal, setShowPartSummaryModal] = useState(false)

  useEffect(() => {
    const fetchNewOrderNumber = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/new-order-number"
        )
        const result = await response.json()

        if (result.success) {
          setOrderNumber(result.new_order_number)
        } else {
          console.error("Failed to fetch new order number.")
        }
      } catch (error) {
        console.error("Error fetching new order number:", error)
      }
    }

    fetchNewOrderNumber()
  }, [])

  const saveCustomerToBackend = async (name, phone, address) => {
    try {
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      })

      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Failed to save customer")
      return data
    } catch (err) {
      console.error("Error saving customer:", err)
      throw err
    }
  }

  const fetchCustomerByMobile = debounce(async (mobile) => {
    try {
      if (!mobile.trim()) return
      const res = await fetch(
        `http://localhost:5000/api/customers/by-phone?phone=${encodeURIComponent(
          mobile
        )}`
      )
      const customer = await res.json()

      if (customer && customer.name) {
        setCustomerName(customer.name || "")
        setCustomerAddress(customer.address || "")
        setIsExistingCustomer(true)
      } else {
        setCustomerName("")
        setCustomerAddress("")
        setIsExistingCustomer(false)
      }
    } catch (error) {
      console.error("Customer fetch error:", error)
    }
  }, 300)

  const closeAllOverlays = () => {
    setShowCustomerForm(false)
    setShowPeopleInput(false)
    setShowCartView(true)
  }

  return (
    <>
      <div className="border-b border-gray-200 py-2 px-4 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300"
            title="Customer Info"
            onClick={() => {
              setShowCustomerForm(true)
              setShowPeopleInput(false)
              setShowCartView(false)
            }}
          >
            <UserRound size={16} className="text-gray-700" />
          </button>

          <span className="h-5 w-px bg-gray-300" />

          <button
            className={`p-1.5 rounded border ${
              peopleCount > 0
                ? "bg-green-100 border-green-500 text-green-700"
                : "bg-gray-100 hover:bg-gray-200 border-gray-300"
            }`}
            title="No. of People"
            onClick={() => {
              setShowPeopleInput(true)
              setShowCustomerForm(false)
              setShowCartView(false)
            }}
          >
            <Users size={16} />
          </button>

          <span className="h-5 w-px bg-gray-300" />

          <button
            className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300"
            title="Order Instructions"
          >
            <StickyNote size={16} className="text-gray-700" />
          </button>

          <span className="h-5 w-px bg-gray-300" />

          <button
            className="p-1.5 bg-gray-100 rounded hover:bg-gray-200 border border-gray-300"
            title="Assign Waiter"
          >
            <ConciergeBell size={16} className="text-gray-700" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-700 relative">
          {Array.isArray(partPaymentDetails) && partPaymentDetails.length > 0 && (
            <button
              className="p-1.5 mr-2 bg-yellow-50 rounded hover:bg-yellow-100 border border-yellow-300"
              title="View Part Payment Details"
              onClick={() => setShowPartSummaryModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-600"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
          )}

          <FilePenLine size={16} className="text-gray-600" />
          <span className="font-medium">Order #{orderNumber || "Loading..."}</span>

          {/* Modal Display */}
          {showPartSummaryModal && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-white p-4 rounded-lg shadow-lg w-80 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">Part Payment Details</h3>
                <button
                  onClick={() => setShowPartSummaryModal(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto text-sm">
                {Array.isArray(partPaymentDetails) && partPaymentDetails.length > 0 ? (
                <>
                  {typeof partPaymentDetails === "string" ? (
                   <>
                    {partPaymentDetails.split("\n").map((line, index) => (
                      <div key={index} className="py-1 border-b text-sm text-gray-800">
                        {line}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-gray-500 italic">No part payments available.</div>
                )}

                  <div className="pt-2 mt-2 border-t flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ₹
                      {partPaymentDetails.reduce(
                        (total, p) => total + Number(p.amount),
                        0
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 italic">No part payments available.</div>
              )}

                <div className="pt-2 mt-2 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    ₹
                    {partPaymentDetails.reduce(
                      (total, p) => total + Number(p.amount),
                      0
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Info Form */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={closeAllOverlays}
            >
              <X size={18} />
            </button>

            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Mobile No
            </label>
            <input
              type="tel"
              value={customerMobile}
              onChange={(e) => {
                const value = e.target.value
                setCustomerMobile(value)
                fetchCustomerByMobile(value)
              }}
              className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none"
            />

            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full mb-2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none"
            />

            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Address
            </label>
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none resize-none"
              rows={2}
            ></textarea>

            <button
              className="mt-3 w-full bg-black text-white text-sm py-1.5 rounded hover:bg-gray-900 transition"
              onClick={async () => {
                try {
                  if (!isExistingCustomer) {
                    await saveCustomerToBackend(
                      customerName,
                      customerMobile,
                      customerAddress
                    )
                    alert("Customer saved successfully")
                  } else {
                    alert("Customer already exists.")
                  }

                  handleSaveCustomer()
                  closeAllOverlays()
                } catch (error) {
                  if (!isExistingCustomer) {
                    alert("Failed to save customer. Please try again.")
                  }
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* People Count Input */}
      {showPeopleInput && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-64 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={closeAllOverlays}
            >
              <X size={18} />
            </button>

            <label className="text-xs font-medium mb-1 block text-gray-600">
              No. of People
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
              />
              <button
                className="text-green-600 hover:text-green-800"
                onClick={closeAllOverlays}
              >
                <CheckCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderTypeToggle
