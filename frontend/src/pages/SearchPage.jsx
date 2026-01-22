import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../context/UserContext";

const SearchPage = () => {
  const userData = UserData();
  const { searchQuery, setSearchQuery, darkMode } = userData;
  const [suggestions] = useState([
    "Explore something new",
    "Men's Outfit by Occasions",
    "Cute Hairstyles",
    "DIY and Crafts",
  ]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/`);
    }
  };

  return (
    <div
      className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900"
          : "bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50"
      }`}
    >
      {/* Search Header */}
      <div
        className={`sticky top-18 z-40 backdrop-blur-xl px-4 py-3 transition-all duration-300`}
      >
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-zinc-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search pins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-3xl border focus:outline-none focus:ring-2 focus:ring-rose-500 text-lg transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-800/60 border-zinc-700 text-white placeholder-zinc-400"
                  : "bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </form>
      </div>

      {/* Suggestions */}
      <div
        className={`pt-22 px-4 space-y-4 transition-all duration-300 ${
          darkMode ? "pb-20" : ""
        }`}
      >
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 border overflow-hidden cursor-pointer ${
                darkMode
                  ? "bg-zinc-800/70 border-zinc-700/50 hover:bg-zinc-700/70"
                  : "bg-white/70 border-gray-100/50 hover:bg-white/90"
              }`}
              onClick={() => setSearchQuery(suggestion)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className={`font-semibold text-base leading-tight line-clamp-2 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {suggestion}
                </h3>
                <ChevronRight
                  size={20}
                  className={`transition-colors ${
                    darkMode
                      ? "text-zinc-400 group-hover:text-rose-400"
                      : "text-gray-400 group-hover:text-rose-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 h-32 overflow-hidden rounded-xl">
                <div className="bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg" />
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg" />
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg" />
                <div className="bg-gradient-to-br from-purple-400 to-violet-500 rounded-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
