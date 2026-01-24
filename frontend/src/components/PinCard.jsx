import { Link } from "react-router-dom";
import { useState } from "react";

const PinCard = ({ pin }) => {
  const [showSaveIcon, setShowSaveIcon] = useState(false);

  // const savePin = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000/api/pin/save", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include", // token/cookie
  //       body: JSON.stringify({ pinId: pin._id }),
  //     });

  //     const data = await res.json();
  //     console.log(data.message);
  //   } catch (err) {
  //     console.error("Save failed", err);
  //   }
  // };

  const handleSavePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("http://localhost:5000/api/pin/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinId: pin._id }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.message); // "Pin saved successfully"
        setShowSaveIcon(true);
        setTimeout(() => setShowSaveIcon(false), 1000);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.error("Save pin error:", err);
    }
  };

  return (
    <div className="block relative group">
      <Link to={`/pin/${pin._id}`} className="block">
        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white">
          <div className="aspect-[2/3] w-full relative">
            <img
              src={pin.image?.url || "/placeholder.jpg"}
              alt={pin.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
              <div className="text-white w-full flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {pin.title}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-1">
                    {pin.description}
                  </p>
                </div>
                {/* 👇 Save Button */}
                {/* <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                      const res = await fetch("/api/pin/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include", // cookies / token ke liye
                        body: JSON.stringify({ pinId: pin._id }),
                      });

                      const data = await res.json();
                      console.log(data.message); // "Pin saved successfully" ya error

                      setShowSaveIcon(true); // animation
                      setTimeout(() => setShowSaveIcon(false), 800);
                    } catch (err) {
                      console.error("Save failed", err);
                    }
                  }}
                  className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-2xl active:translate-y-[2px] transition-all duration-200 ml-2"
                  title="Save"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 00.683 1.541l3.656 2.525a1 1 0 001.518 0l3.656-2.525A2 2 0 0015 11.268V4a1 1 0 10-2 0v7.268a1 1 0 01-.683.797l-3.656 2.525a1 1 0 01-1.518 0l-3.656-2.525A1 1 0 015 11.268V4z" />
                  </svg>
                </button> */}
                <button
                  onClick={handleSavePin}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-200 ml-2"
                  title="Save"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 00.683 1.541l3.656 2.525a1 1 0 001.518 0l3.656-2.525A2 2 0 0015 11.268V4a1 1 0 10-2 0v7.268a1 1 0 01-.683.797l-3.656 2.525a1 1 0 01-1.518 0l-3.656-2.525A1 1 0 015 11.268V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PinCard;
