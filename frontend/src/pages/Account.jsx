import React, { useState, useMemo } from "react";
import { UserData } from "../context/UserContext";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { Loading } from "../components/Loading";
import { FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api, { pinAPI } from "../utils/axios.js";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const { user, setIsAuth, darkMode } = UserData();
  const { pins, loading: pinsLoading } = PinData();

  // STATES FOR EDIT MODE
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  // SAFE user pins filtering
  const userPins = useMemo(() => {
    if (!Array.isArray(pins) || !user?._id) return [];
    return pins.filter(
      (pin) => pin.owner === user._id || pin.user?._id === user._id,
    );
  }, [pins, user]);

  // HANDLE PROFILE PIC CHANGE
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(file);
      setProfilePic(file);
    }
  };

  // EDIT PROFILE
  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const formData = new FormData();
      formData.append("name", editName);
      if (editBio.trim()) formData.append("bio", editBio);
      if (profilePic) formData.append("profilePic", profilePic);

      await api.put("/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated!");
      setEditMode(false);
      setProfilePic(null);
      setProfilePicPreview("");
      window.location.reload(); // To get updated user data
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // DELETE PIN
  const deletePinHandler = async (pinId) => {
    if (!confirm("Delete this pin forever?")) return;

    try {
      await api.delete(`/pin/${pinId}`);
      toast.success("Pin deleted!");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // LOGOUT
  const logoutHandler = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await api.get("/user/logout");
      toast.success("Successfully logged out!");
      setIsAuth(false);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-16 ${
        darkMode
          ? "bg-neutral-900 text-neutral-100"
          : "bg-neutral-100 text-neutral-400"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* PROFILE HEADER */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm p-8 mb-12">
          <div className="flex flex-col items-center text-center gap-4">
            {/* AVATAR WITH CAMERA */}
            <div className="relative group">
              <div
                className={`
                w-32 h-32 rounded-full overflow-hidden ring-4
                ${
                  darkMode
                    ? "ring-zinc-700/50 shadow-zinc-500/25 bg-neutral-700"
                    : "ring-white/60 shadow-white/25 bg-neutral-200"
                }
              `}
              >
                {profilePicPreview || user.profilePic?.url ? (
                  <img
                    src={profilePicPreview || user.profilePic.url}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <div
                    className={`
                    w-full h-full flex items-center justify-center text-3xl font-sebold 
                    ${
                      darkMode
                        ? "bg-neutral-800 text-zinc-200"
                        : "bg-neutral-600 text-neutral-200"
                    }
                  `}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>

              {/* ✅ CAMERA ICON */}
              <label
                className={`
                absolute -bottom-2 -right-2 p-3 rounded-full shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 
                ${
                  darkMode
                    ? "bg-zinc-700 text-zinc-200 shadow-zinc-500/30 ring-2 ring-zinc-600/50"
                    : "bg-zinc-300 text-gray-700 shadow-white/50 ring-2 ring-white/50"
                }
              `}
              >
                <FaCamera size={18} className="drop-shadow-lg" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>

            {/* NAME */}
            {editMode ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-semibold bg-transparent border-b border-neutral-400 focus:outline-none text-center"
              />
            ) : (
              <h1 className="text-2xl font-semibold">{user.name}</h1>
            )}

            {/* BIO */}
            {editMode ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full max-w-md bg-transparent border border-neutral-300 dark:border-neutral-600 rounded-lg p-2 text-sm resize-none"
                rows="2"
              />
            ) : (
              <p className="text-sm text-neutral-600 dark:text-neutral-200 max-w-md">
                {user.bio || "No bio added"}
              </p>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">
              {editMode ? (
                <button
                  onClick={handleEditProfile}
                  className="px-5 py-2 rounded-lg bg-neutral-900 text-white text-sm"
                >
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 py-2 rounded-lg border text-sm"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="px-5 py-2 text-neutral-200 bg-red-700 hover:bg-red-800 rounded-lg border text-sm"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="flex justify-center gap-10 mt-8 text-center">
            <div>
              <p className="text-xl font-semibold">{userPins.length}</p>
              <p className="text-xs text-neutral-200">Pins</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {user.followers?.length || 0}
              </p>
              <p className="text-xs text-neutral-200">Followers</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {user.following?.length || 0}
              </p>
              <p className="text-xs text-neutral-200">Following</p>
            </div>
          </div>
        </div>
        {/* PINS */}
        <h2
          className={`text-lg font-semibold mb-6 ${
            darkMode ? "text-zinc-200" : "text-zinc-700"
          }
              `}
        >
          Your Pins
        </h2>

        {pinsLoading ? (
          <Loading />
        ) : userPins.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {userPins.map((pin) => (
              <div key={pin._id} className="relative group">
                <PinCard pin={pin} />
                <button
                  onClick={() => deletePinHandler(pin._id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/70 text-white p-1.5 rounded-full"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No pins yet.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
