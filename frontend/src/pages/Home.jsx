import React from "react";
import { useNavigate } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/UserContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";
import { motion } from "framer-motion";
import PinterestLogo from "../assets/pinterest.svg";
import { ArrowDown } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";

const Home = () => {
  const navigate = useNavigate();
  const { pins, loading } = PinData();
  const { isAuth, darkMode, searchQuery = "" } = UserData(); // ✅ Default ""

  // ✅ LANDING PAGE IF NOT LOGGED IN
  if (!isAuth) {
    return (
      <div
        className={`
        min-h-screen relative overflow-hidden transition-colors duration-300
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-zinc-100"
            : "bg-gradient-to-br from-white via-rose-50 to-pink-50 text-gray-900"
        }
      `}
      >
        {/* Background Pins */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl" />
          <div className="absolute top-40 right-20 w-40 h-64 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl shadow-xl" />
          <div className="absolute bottom-32 left-1/4 w-28 h-40 bg-gradient-to-t from-green-400 to-emerald-400 rounded-lg shadow-xl" />
          <div className="absolute bottom-20 right-1/2 w-36 h-52 bg-gradient-to-b from-orange-400 to-red-500 rounded-2xl shadow-2xl" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto pt-24 pb-16 px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto w-24 h-24 mb-8 p-4 rounded-2xl bg-red-900 shadow-2xl"
            >
              <img
                src={PinterestLogo}
                alt="Pinterest"
                className="w-full h-full"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className={`
                text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 bg-gradient-to-r bg-clip-text text-transparent drop-shadow-2xl
                ${
                  darkMode
                    ? "from-zinc-200 via-white to-zinc-400"
                    : "from-gray-900 via-gray-700 to-gray-900"
                }
              `}
            >
              Get your next
              <br />
              <span className="block text-rose-900 drop-shadow-lg">idea</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate("/register")}
                className="relative px-12 py-4 rounded-full font-semibold
                bg-red-800 text-black shadow-[0_8px_0_#5f0000] 
                active:translate-y-2 active:shadow-none transition"
              >
                <IoIosArrowDown />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-20 flex flex-col items-center"
            >
              <ArrowDown className="w-6 h-6 animate-bounce text-rose-400 mb-2" />
              <span className={darkMode ? "text-zinc-500" : "text-gray-500"}>
                Discover more
              </span>
            </motion.div>
          </motion.div>

          {/* Demo Pins */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
          >
            {[
              "https://i.pinimg.com/1200x/23/40/da/2340da35f9ba36dc0b96deaf46755bdb.jpg",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=700&fit=crop",
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=700&fit=crop",
              "https://i.pinimg.com/1200x/d7/83/82/d783822c29c649be899e949ff8b89d9c.jpg",
              "https://i.pinimg.com/1200x/13/69/44/1369448902794850de2941c46cbcf6c6.jpg",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop",
              "https://i.pinimg.com/1200x/b7/4a/7f/b74a7fe7fe66b9eae18144f81cce4235.jpg",
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=700&fit=crop",
              "https://i.pinimg.com/736x/27/3c/4d/273c4d2aa34b3a3a354660db07397d8d.jpg",
              "https://i.pinimg.com/736x/57/b3/ad/57b3adcdc543a6d8f2f5090c9fb2d5e9.jpg",
            ].map((src, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Demo pin ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className={darkMode ? "text-white/90" : "text-white"}>
                    Save idea
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ EXISTING PINS PAGE WITH SEARCH FILTER
  return (
    <div
      className={`
      min-h-screen pt-20 transition-colors duration-300
      ${
        darkMode
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-zinc-100"
          : "bg-gradient-to-br from-white to-red-50 text-gray-900"
      }
    `}
    >
      {loading ? (
        <div
          className={`
          flex items-center justify-center min-h-screen
          ${
            darkMode
              ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
              : "bg-gradient-to-br from-white to-red-50"
          }
        `}
        >
          <Loading />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {pins && pins.length > 0 ? (
              // ✅ FIXED FILTER - Inside return statement
              pins
                ?.filter((pin) => {
                  const query = (searchQuery || "").toLowerCase(); // ✅ Safe!
                  if (!query) return true;

                  const title = (pin.title || "").toLowerCase();
                  const description = (pin.description || "").toLowerCase();

                  return title.includes(query) || description.includes(query);
                })
                .map((pin) => <PinCard key={pin._id} pin={pin} />)
            ) : (
              <div className="col-span-full text-center py-24">
                <div
                  className={`
                  w-24 h-24 mx-auto mb-6 transition-colors
                  ${darkMode ? "text-zinc-600" : "text-gray-400"}
                `}
                >
                  {/* Empty state */}
                </div>
                <a
                  href="/register"
                  className="inline-block bg-red-700 hover:bg-red-800 text-white px-8 py-3 rounded-xl font-semibold text-lg"
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
