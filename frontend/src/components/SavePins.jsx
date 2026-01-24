import React, { useEffect, useState } from "react";

const SavePins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPins();
  }, []);

  const fetchSavedPins = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pin/saved", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setPins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPins([]);
    } finally {
      setLoading(false);
    }
  };

  const removePin = async (pinId) => {
    await fetch("/api/pin/unsave", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pinId }),
    });

    setPins((prev) => prev.filter((p) => p._id !== pinId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-12 h-12 border-4 border-neutral-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-4 mt-10">
          <h1 className="text-4xl font-bold text-neutral-900">Saved Pins</h1>
          <p className="text-neutral-500 mt-1">
            All the pins you’ve saved in one place
          </p>
        </div>

        {/* EMPTY STATE */}
        {pins.length === 0 ? (
          <div className="text-center py-32">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-3">
              No saved pins
            </h2>
            <p className="text-neutral-500 mb-6">
              Save pins to see them here later
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 rounded-xl font-medium
              bg-black text-white
              shadow-[0_6px_0_#111]
              hover:translate-y-[2px]
              hover:shadow-[0_4px_0_#111]
              active:translate-y-[6px]
              active:shadow-none
              transition-all"
            >
              Explore Pins
            </a>
          </div>
        ) : (
          /* PINS GRID */
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {pins.map((pin) => (
              <div
                key={pin._id}
                className="mb-6 break-inside-avoid bg-white rounded-2xl overflow-hidden
                shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={pin.image?.url || pin.image}
                    alt={pin.title}
                    className="w-full object-cover"
                  />

                  {/* REMOVE BUTTON (3D) */}
                  <button
                    onClick={() => removePin(pin._id)}
                    className="
                      absolute top-3 right-3
                      px-4 py-2 text-sm font-semibold
                      bg-white text-black rounded-xl
                      shadow-[0_5px_0_#999]
                      hover:translate-y-[2px]
                      hover:shadow-[0_3px_0_#999]
                      active:translate-y-[5px]
                      active:shadow-none
                      transition-all
                    "
                  >
                    Remove
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-neutral-900 line-clamp-2">
                    {pin.title}
                  </h3>
                  <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                    {pin.description || pin.pin}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePins;
