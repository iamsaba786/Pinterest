import React, { useEffect, useState } from "react";
import PinCard from "../components/PinCard";
import { UserData } from "../context/UserContext";

const SavePins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = UserData();

  const fetchSavedPins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pin/saved", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setPins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching saved pins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPins();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen pt-24 text-center font-medium ${darkMode ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
      >
        <div className="animate-bounce">Loading your collection...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-20 transition-colors duration-300 ${darkMode ? "bg-zinc-950 text-white" : "bg-white text-black"}`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Saved Pins
          </h1>
          <p
            className={`text-sm mt-2 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
          >
            {pins.length} {pins.length === 1 ? "Pin" : "Pins"} saved to your
            account
          </p>
        </div>

        {/* Empty State */}
        {pins.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 space-y-4">
            <div
              className={`p-6 rounded-full ${darkMode ? "bg-zinc-900" : "bg-gray-100"}`}
            >
              <svg
                className="w-12 h-12 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </div>
            <p
              className={`text-lg font-medium ${darkMode ? "text-zinc-400" : "text-gray-500"}`}
            >
              No pins saved yet. Start exploring!
            </p>
          </div>
        ) : (
          /* Pinterest Style Responsive Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pins.map((pin) => (
              <div key={pin._id} className="break-inside-avoid">
                <PinCard pin={pin} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePins;
