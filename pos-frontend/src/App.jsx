import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ItemsPage from "./pages/ItemsPage";
import OrdersPage from "./pages/OrdersPage"; // <-- Import OrdersPage
import OrderDetailsPage from "./pages/OrderDetailsPage"; // <-- Make sure this path is correct
import './index.css';

const App = () => {
  return (
    <Router>
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

        {/* Order Details Page (Dynamic route) */}
        <Route
          path="/orders/:orderId"
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
    </Router>
  );
};

export default App;
