import React from "react";
import {
  FaBars,
  FaBell,
  FaClock,
  FaClipboardList,
  FaPhone,
  FaPlusCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleNewOrder = () => {
    // Refresh ItemsPage route
    navigate("/items", { replace: true });
    window.location.reload(); // Force reload for a fresh state
  };

  return (
    <nav className="bg-black text-white p-4 flex items-center justify-between">
      {/* Left: Sidebar Toggle + Restaurant Name + New Order Button */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-white text-2xl md:hidden">
          {/* Hide hamburger on medium+ screens if you want */}
          <FaBars />
        </button>
        <h1 className="text-lg font-bold">Restaurant POS</h1>

        {/* New Order Button */}
        <button
          onClick={handleNewOrder}
          className="flex items-center gap-2 bg-[#E74C3C] text-white px-3 py-1 rounded-lg hover:bg-[red] text-sm shadow-sm"
        >
          <FaPlusCircle className="text-sm" />
          <span>New Order</span>
        </button>
      </div>

      {/* Middle: Blank Space */}
      <div className="flex-1"></div>

      {/* Right: Call for Support + Icons */}
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 text-white hover:text-[red]">
          <FaPhone />
          <span>Call for Support</span>
        </button>
        <FaClock className="text-xl hover:text-[red] cursor-pointer" />
        <FaBell className="text-xl hover:text-[red] cursor-pointer" />
        <FaClipboardList className="text-xl hover:text-[red] cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
