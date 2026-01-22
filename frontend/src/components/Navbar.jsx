import { useState } from "react";
import PinterestLogo from "../assets/pinterest.svg";
import { motion } from "framer-motion";
import { UserData } from "../context/UserContext";
import {
  Search,
  Home,
  Plus,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const userData = UserData();
  const {
    isAuth,
    user,
    logout,
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
  } = userData;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl shadow-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-zinc-900/98 backdrop-brightness-110 border-zinc-800 shadow-black/40"
            : "bg-white/95 backdrop-brightness-105 border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo (all screens) */}
          <Link to="/">
            <img src={PinterestLogo} alt="Pinterest" className="h-7 w-auto" />
          </Link>

          {/* Search Bar – sirf md+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-zinc-400" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Search pins, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-3xl focus:outline-none transition-all duration-300 font-medium text-base shadow-lg ${
                darkMode
                  ? "bg-zinc-800/60 border border-zinc-700 text-white placeholder-zinc-400 focus:bg-zinc-800/80 focus:border-zinc-500 shadow-zinc-900/20 hover:border-zinc-600"
                  : "bg-white/80 border border-gray-200 shadow-md focus:shadow-xl hover:border-gray-300 hover:shadow-lg"
              }`}
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-1.5">
            {!isAuth ? (
              <>
                {/* Login / Signup – sirf md+ */}
                <Link
                  to="/login"
                  className={`hidden md:inline-flex px-5 py-2.5 text-sm font-semibold rounded-xl
 transition-all duration-200
 active:translate-y-1
 ${
   darkMode
     ? "text-zinc-300 bg-red-800 shadow-[0_6px_0_#7f1d1d] hover:bg-red-800 hover:text-white hover:border-zinc-600 active:shadow-none"
     : "text-gray-100 bg-red-800 shadow-[0_6px_0_#7f1d1d] active:shadow-none"
 }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className={`hidden md:inline-flex px-6 py-2.5 rounded-xl text-sm font-bold
 transition-all duration-200
 active:translate-y-1
 ${
   darkMode
     ? "bg-gradient-to-r from-zinc-700 to-zinc-600 text-white shadow-[0_6px_0_#3f3f46] hover:bg-zinc-500 active:shadow-none"
     : "bg-gradient-to-r from-zinc-700 to-zinc-600 text-white shadow-[0_6px_0_#3f3f46] hover:bg-zinc-500 active:shadow-none"
 }`}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                {/* Desktop right side icons (md+), Pinterest style */}
                <div className="hidden md:flex items-center space-x-1.5">
                  <Link
                    to="/"
                    className={`p-2.5 rounded-2xl transition-all duration-200 hover:shadow-md ${
                      darkMode
                        ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/70 shadow-zinc-900/20"
                        : "text-gray-600 hover:text-rose-500 hover:bg-rose-50 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <Home size={20} />
                  </Link>

                  <button
                    onClick={() => navigate("/create")}
                    className={`p-2.5 rounded-2xl transition-all duration-200 relative shadow-sm hover:shadow-md ${
                      darkMode
                        ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/70"
                        : "text-gray-600 hover:text-rose-500 hover:bg-rose-50"
                    }`}
                  >
                    <Plus size={20} />
                  </button>

                  <div
                    className={`p-2.5 rounded-2xl relative transition-all duration-200 ${
                      darkMode
                        ? "text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/70"
                        : "text-gray-600 hover:text-rose-500 hover:bg-rose-50"
                    }`}
                  >
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      3
                    </span>
                  </div>

                  {/* Profile picture – desktop */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 p-px shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:rotate-3 flex items-center justify-center">
                    {user?.profilePic?.url ? (
                      <img
                        src={user.profilePic.url}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-white/50"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50 font-bold text-sm text-gray-800">
                        {getInitials(user?.name)}
                      </div>
                    )}
                  </div>

                  {/* Desktop hamburger (optional dropdown) */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md ${
                      darkMode
                        ? "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.button>
                </div>

                {/* Mobile top-right: sirf profile pic */}
                <div className="md:hidden">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 p-px shadow-xl flex items-center justify-center">
                    {user?.profilePic?.url ? (
                      <img
                        src={user.profilePic.url}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover shadow-lg ring-2 ring-white/50"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50 font-bold text-xs text-gray-800">
                        {getInitials(user?.name)}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Small dropdown (mainly desktop) */}
        {isAuth && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -8 }}
            className={`absolute right-4 top-full mt-3 w-64 rounded-3xl shadow-2xl border py-3 px-2 overflow-hidden z-50 ${
              darkMode
                ? "bg-zinc-900/95 shadow-black/70 backdrop-blur-xl border-zinc-800/50 backdrop-brightness-150"
                : "bg-zinc-900/95 shadow-white/20 border-gray-100/50 backdrop-blur-xl"
            }`}
          >
            {/* profile */}
            <Link
              to="/account"
              className={`flex items-center px-5 py-4 text-base font-semibold rounded-2xl transition-all duration-200 w-full ${
                darkMode
                  ? "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                  : "text-gray-300 hover:bg-gray-50/80"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-6 h-6 mr-4" /> Profile
            </Link>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center px-5 py-4 text-base font-semibold rounded-2xl w-full text-left transition-all duration-200 ${
                darkMode
                  ? "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                  : "text-gray-300 hover:bg-gray-50/80"
              }`}
            >
              <motion.div
                animate={{ rotate: darkMode ? 0 : 180 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-6 mr-4 flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 p-1 shadow-lg"
              >
                {darkMode ? (
                  <Sun size={18} className="text-yellow-900" />
                ) : (
                  <Moon size={18} className="text-gray-900" />
                )}
              </motion.div>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-5 py-4 text-base font-semibold text-rose-600 hover:bg-rose-500/10 rounded-2xl transition-all duration-200 ${
                darkMode ? "hover:text-rose-300" : "hover:bg-rose-50"
              }`}
            >
              <LogOut className="w-6 h-6 mr-4" /> Logout
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* BOTTOM BAR – only mobile, Pinterest style */}
      {isAuth && (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t py-3 ${
            darkMode
              ? "bg-zinc-900/98 text-zinc-300 border-zinc-800"
              : "bg-white/95 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-around px-4">
            <button
              onClick={() => navigate("/")}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <Home size={22} />
            </button>

            <button
              onClick={() => {
                navigate("/search");
              }}
              className="flex flex-col items-center justify-center gap-0.5 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-zinc-800"
            >
              <Search size={22} />
            </button>

            <button
              onClick={() => navigate("/create")}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              <Plus size={26} />
            </button>

            <button className="flex flex-col items-center justify-center gap-0.5">
              <Bell size={22} />
            </button>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex flex-col items-center justify-center gap-0.5"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
