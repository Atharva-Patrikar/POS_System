// src/context/BillingContext.jsx
import { createContext, useState } from "react";

export const BillingContext = createContext();

export const BillingProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [activeTab, setActiveTab] = useState("Dine In");
  const [tableNumber, setTableNumber] = useState("");

  return (
    <BillingContext.Provider
      value={{
        cart,
        setCart,
        paymentMethod,
        setPaymentMethod,
        activeTab,
        setActiveTab,
        tableNumber,
        setTableNumber,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};
