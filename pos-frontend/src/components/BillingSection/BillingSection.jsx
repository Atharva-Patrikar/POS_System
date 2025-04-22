"use client"

import { useEffect, useState } from "react"
import { FaCreditCard, FaMoneyBillWave, FaMobile } from "react-icons/fa"
import OrderTypeToggle from "./OrderTypeToggle"
import SelectedItems from "./SelectedItems"
import DiscountInput from "./DiscountInput"
import TotalSummary from "./TotalSummary"
import ActionButtons from "./ActionButtons"

const BillingSection = ({
  cart,
  setCart,
  totalPrice,
  paymentMethod,
  setPaymentMethod,
  tableNumber,
  peopleCount,
  setPeopleCount,
  customerName,
  setCustomerName,
  customerMobile,
  setCustomerMobile,
  customerAddress,
  setCustomerAddress,
  activeTab,
  setActiveTab,  // Ensure setActiveTab is passed here
}) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountType, setDiscountType] = useState("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [showPeopleInput, setShowPeopleInput] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showDiscountOverlay, setShowDiscountOverlay] = useState(false)

  useEffect(() => {
    if (cart.length === 0) {
      setAppliedDiscount(0)
      setDiscountValue(0)
      setShowDiscount(false)
    }
  }, [cart])

  const updateQuantity = (id, qty) => {
    const newQty = parseInt(qty, 10)
    if (!isNaN(newQty) && newQty > 0) {
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
      )
    }
  }

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    )
  }

  const addToCart = (dish) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === dish.id ? { ...item, qty: item.qty + 1 } : item))
    )
  }

  const handleApplyDiscount = (overrideValue = null) => {
    const valueToApply = overrideValue !== null ? parseFloat(overrideValue) : parseFloat(discountValue || 0)
    const amount = discountType === "percentage" ? (totalPrice * valueToApply) / 100 : valueToApply
    setAppliedDiscount(amount)
    setShowDiscountOverlay(false)
  }   

  const handleRemoveDiscount = () => {
    setDiscountValue(0)
    setAppliedDiscount(0)
    setShowDiscount(false)
  }

  const handleSaveCustomer = () => {
    console.log("Customer Info Saved:", {
      name: customerName,
      mobile: customerMobile,
      address: customerAddress,
    })
  }

  const taxAmount = totalPrice * 0.05
  const grandTotal = totalPrice + taxAmount - appliedDiscount

  const customerDetails = {
    name: customerName,
    phone: customerMobile,
    address: customerAddress,
  }

  return (
    <div className="w-2/4 bg-white border-l border-gray-200 shadow-sm flex flex-col h-screen">
    {/* Scrollable Area */}
    <div className="p-2">
      <OrderTypeToggle
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showCustomerForm={showCustomerForm}
        setShowCustomerForm={setShowCustomerForm}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerMobile={customerMobile}
        setCustomerMobile={setCustomerMobile}
        customerAddress={customerAddress}
        setCustomerAddress={setCustomerAddress}
        handleSaveCustomer={handleSaveCustomer}
        peopleCount={peopleCount}
        setPeopleCount={setPeopleCount}
        showPeopleInput={showPeopleInput}
        setShowPeopleInput={setShowPeopleInput}
      />

      <div className="mt-1 px-2">
        <div className="h-[200px] overflow-y-auto pr-1">
          <SelectedItems
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            addToCart={addToCart}
            removeItem={removeItem}
          />
        </div>
      </div>
    </div>


    {/* Fixed Bottom Section */}
    <div className="border-t border-gray-200 bg-gray-50 px-3 pt-2 pb-1">
      <TotalSummary
        totalPrice={totalPrice}
        taxAmount={taxAmount}
        appliedDiscount={appliedDiscount}
        onDiscountClick={() => setShowDiscountOverlay(true)}
      />

      <DiscountInput
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        handleApplyDiscount={handleApplyDiscount}
        appliedDiscount={appliedDiscount}
        showDiscountOverlay={showDiscountOverlay}
        setShowDiscountOverlay={setShowDiscountOverlay}
        handleRemoveDiscount={handleRemoveDiscount} // ← Include this prop in DiscountInput
      />

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Cash", icon: <FaMoneyBillWave className="text-sm" /> },
            { label: "Card", icon: <FaCreditCard className="text-sm" /> },
            { label: "UPI", icon: <FaMobile className="text-sm" /> },
            { label: "Part" },
          ].map((method) => (
            <button
              key={method.label}
              onClick={() => setPaymentMethod(method.label)}
              className={`flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-md border transition-colors duration-150 ${
                paymentMethod === method.label
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {method.icon}
              {method.label}
            </button>
          ))}
        </div>
      </div>

      <ActionButtons
        cart={cart}
        grandTotal={grandTotal}
        paymentMethod={paymentMethod}
        setPdfUrl={setPdfUrl}
        pdfUrl={pdfUrl}
        tableNumber={tableNumber}
        peopleCount={peopleCount}
        customerDetails={customerDetails}
        activeTab={activeTab}
        orderType={activeTab}
      />
    </div>
  </div>
  )
}
export default BillingSection
