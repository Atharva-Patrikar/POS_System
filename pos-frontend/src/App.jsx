import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ItemsPage from "./pages/ItemsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage"; // <-- Import OrderDetailsPage
import { CartProvider } from "./context/CartContext"; // <-- Import CartProvider
import './index.css';

const App = () => {
  return (
    <Router>
      <CartProvider> {/* Wrap the Routes with CartProvider */}
        <Routes>
          {/* Items Page */}
          <Route
            path="/items"
            element={
              <Layout>
                <ItemsPage />
              </Layout>
            }
          />

          {/* Orders Page */}
          <Route
            path="/orders"
            element={
              <Layout>
                <OrdersPage />
              </Layout>
            }
          />

          {/* Order Details Page */}
          <Route
            path="/orders/:id"
            element={
              <Layout>
                <OrderDetailsPage />
              </Layout>
            }
          />

          {/* Default route */}
          <Route
            path="/"
            element={
              <Layout>
                <ItemsPage />
              </Layout>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;