import React from "react"
import { FaSearch } from "react-icons/fa"

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative flex-1 max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search dishes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
      />
    </div>
  )
}

export default SearchBar
