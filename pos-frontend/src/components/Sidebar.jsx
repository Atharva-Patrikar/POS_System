// src/components/Sidebar.jsx
import React from "react";
import {
  FaSignOutAlt,
  FaTachometerAlt,
  FaClipboardList,
  FaChartBar,
  FaTools
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate(); // <-- init

  return (
    <aside
      className={`bg-white h-screen shadow-md border-r border-gray-200 transition-all duration-200 ease-out
        ${isOpen ? "w-52 p-4" : "w-0 p-0"} 
        ${isOpen ? "overflow-visible" : "overflow-hidden"}`}
    >
      <ul className="space-y-3 text-sm">
        <li
          className="group flex items-center gap-3 text-gray-800 font-medium hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition-all"
          onClick={() => navigate("/")} // Dashboard route (use later)
        >
          <FaTachometerAlt className="text-black group-hover:text-[red]" />
          <span className="group-hover:text-[#E67E73]">Billing</span>
        </li>

        <li
          className="group flex items-center gap-3 text-gray-800 font-medium hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition-all"
          onClick={() => navigate("/orders")} // <-- navigate to orders page
        >
          <FaClipboardList className="text-black group-hover:text-[red]" />
          <span className="group-hover:text-[#E67E73]">Orders</span>
        </li>

        <li
          className="group flex items-center gap-3 text-gray-800 font-medium hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition-all"
        >
          <FaChartBar className="text-black group-hover:text-[red]" />
          <span className="group-hover:text-[#E67E73]">Reports</span>
        </li>

        <li
          className="group flex items-center gap-3 text-gray-800 font-medium hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition-all"
        >
          <FaTools className="text-black group-hover:text-[red]" />
          <span className="group-hover:text-[#E67E73]">Configuration</span>
        </li>

        <li
          className="group flex items-center gap-3 text-red-600 font-medium hover:bg-red-100 px-3 py-2 rounded-md cursor-pointer mt-10 transition-all"
        >
          <FaSignOutAlt className="group-hover:text-red-700" />
          <span className="group-hover:text-red-700">Logout</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
