"use client"

import { useState, useEffect, useContext } from "react"
import { CartContext } from "../context/CartContext";
import BillingSection from "../components/BillingSection/BillingSection"
import axios from "axios"
import { FaUtensils, FaMotorcycle, FaShoppingBag } from "react-icons/fa"
import SearchBar from "../components/SearchBar"

const ItemsPage = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [allDishes, setAllDishes] = useState([])
  const [dishes, setDishes] = useState([])
  const { cart, setCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Dine In")
  const [tableNumber, setTableNumber] = useState("")
  const [peopleCount, setPeopleCount] = useState(0)
  const [customerName, setCustomerName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories")
        const sorted = response.data.sort((a, b) => (a.name === "Recommended" ? -1 : b.name === "Recommended" ? 1 : 0))
        // Add "All" category at the beginning
        const allCategory = { id: "all", name: "All" }
        const categoriesWithAll = [allCategory, ...sorted]
        setCategories(categoriesWithAll)
        if (categoriesWithAll.length > 0) setSelectedCategory(categoriesWithAll[0].id)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchAllDishes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dishes")
        setAllDishes(response.data)
        console.log("All dishes fetched:", response.data) // ✅ check this
      } catch (error) {
        console.error("Failed to fetch all dishes:", error)
      }
    }
    fetchAllDishes()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return

    if (selectedCategory === "all") {
      // If "All" category is selected, use all dishes
      setDishes(allDishes)
      return
    }

    const fetchDishes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/dishes/category/${selectedCategory}`)
        setDishes(response.data)
      } catch (error) {
        console.error("Failed to fetch dishes:", error)
      }
    }
    fetchDishes()
  }, [selectedCategory, allDishes])

  const filteredDishes = searchQuery.trim()
    ? allDishes.filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : dishes

  const handleAddToCart = (dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id)
      return existing
        ? prev.map((item) => (item.id === dish.id ? { ...item, qty: item.qty + 1 } : item))
        : [...prev, { ...dish, qty: 1 }]
    })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-y-hidden">
      {/* Search Bar and Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="flex items-center p-3">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <div className="ml-4 flex items-center">
            {/* Order Type Buttons */}
            <div className="flex">
              <button
                className={`flex items-center px-6 py-2 rounded-l-lg ${
                  activeTab === "Dine In" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={() => setActiveTab("Dine In")}
              >
                <FaUtensils className="mr-2" />
                <span>Dine In</span>
              </button>
              <button
                className={`flex items-center px-6 py-2 ${
                  activeTab === "Delivery" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={() => setActiveTab("Delivery")}
              >
                <FaMotorcycle className="mr-2" />
                <span>Delivery</span>
              </button>
              <button
                className={`flex items-center px-6 py-2 rounded-r-lg ${
                  activeTab === "Pick Up" ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={() => setActiveTab("Pick Up")}
              >
                <FaShoppingBag className="mr-2" />
                <span>Pick Up</span>
              </button>
            </div>

            {/* Table Number Field for Dine In */}
            {activeTab === "Dine In" && (
              <div className="ml-6 flex items-center">
                <label htmlFor="table-number" className="mr-2 text-sm font-medium text-gray-700">
                  Table No.:
                </label>
                <input
                  type="number"
                  id="table-number"
                  placeholder="e.g. 5"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Category Sidebar */}
        <div className="w-1/6.5 bg-white border-r border-gray-200 overflow-y-auto h-[555px]">
          <div className="py-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSearchQuery("")
                }}
                className={`text-sm py-3 px-4 cursor-pointer font-medium transition-all ${
                  selectedCategory === category.id ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* Dishes Section */}
        <div className="w-1/2 flex flex-col bg-gray-50 overflow-hidden">
          {/* Dish Grid */}
          <div className="flex-1 overflow-y-auto h-[560px]">
            <div className="grid grid-cols-3 gap-3">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="relative bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                  onClick={() => handleAddToCart(dish)}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 ${
                      dish.type === "Veg" ? "bg-green-500" : dish.type === "Non-Veg" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="p-3 pl-4">
                    <p className="text-sm font-medium text-gray-800">{dish.name}</p>
                    {dish.price && <p className="text-xs text-gray-500 mt-1">₹{dish.price}</p>}
                  </div>
                </div>
              ))}

              {/* Show only if no dishes and not searching */}
              {!filteredDishes.length && !searchQuery && (
                <div className="col-span-3 flex flex-col items-center justify-center py-10">
                  <div className="bg-gray-100 rounded-full p-4 mb-3">
                    <FaUtensils className="text-gray-400 text-xl" />
                  </div>
                  <p className="text-gray-400 text-center text-sm">No dishes found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Panel */}
        <BillingSection
          cart={cart}
          setCart={setCart}
          totalPrice={cart.reduce((acc, item) => acc + item.price * item.qty, 0)}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          tableNumber={tableNumber}
          peopleCount={peopleCount}
          setPeopleCount={setPeopleCount}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerMobile={customerMobile}
          setCustomerMobile={setCustomerMobile}
          customerAddress={customerAddress}
          setCustomerAddress={setCustomerAddress}
          activeTab={activeTab}
        />
      </div>
    </div>
  )
}

export default ItemsPage
