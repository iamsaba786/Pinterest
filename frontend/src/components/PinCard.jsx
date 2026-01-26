import { Link } from "react-router-dom";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";
// import { useState } from "react";

const PinCard = ({ pin }) => {
  const { user } = UserData();
  const isSaved = pin.savedBy?.includes(user?._id);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch(`${API_URL}/api/pin/save/${pin._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="block relative group">
      {/* save button  */}
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleSave}
          className={`${
            isSaved ? "bg-black" : "bg-red-600 hover:bg-red-700"
          } text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transform active:scale-95 transition-all`}
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
      <Link to={`/pin/${pin._id}`} className="block">
        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white">
          <div className="aspect-[2/3] w-full relative">
            <img
              src={pin.image?.url || "/placeholder.jpg"}
              alt={pin.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-zinc-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
              <div className="text-white w-full flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {pin.title}
                  </h3>
                  <p className="text-sm opacity-90 line-clamp-1">
                    {pin.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PinCard;
