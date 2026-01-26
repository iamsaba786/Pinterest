import React, { useState, useMemo, useEffect } from "react";
import { UserData } from "../context/UserContext";
import { PinData } from "../context/PinContext";
import PinCard from "../components/PinCard";
import { Loading } from "../components/Loading";
import { FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../utils/axios.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Account = () => {
  const navigate = useNavigate();
  const { user, setIsAuth, darkMode } = UserData();
  const { pins, loading: pinsLoading } = PinData();
  const [profileLoading, setProfileLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editBio, setEditBio] = useState(user?.bio || "");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showDeletePinModal, setShowDeletePinModal] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setEditName(user?.name || "");
    setEditBio(user?.bio || "");
  }, [user]);

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
      if (profilePic) formData.append("avatar", profilePic);

      const { data } = await api.put("/user/update", formData);
      toast.success(data.message || "Profile updated!");

      setEditMode(false);
      setProfilePic(null);
      setProfilePicPreview("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  // DELETE PIN
  const deletePinHandler = (pinId) => {
    setSelectedPinId(pinId);
    setShowDeletePinModal(true);
  };

  const handleDeletePinConfirm = async () => {
    if (!selectedPinId) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/pin/${selectedPinId}`);
      toast.success("Pin deleted!");
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
      setShowDeletePinModal(false);
      setSelectedPinId(null);
    }
  };

  // ✅ NEW LOCAL LOGOUT HANDLER
  const handleLogoutConfirm = async () => {
    setShowConfirmModal(false);
    setLogoutLoading(true);

    try {
      await api.get("/user/logout");
      setIsAuth(false);
      localStorage.removeItem("token");
      setShowLogoutModal(true);
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleLogout = () => {
    setShowConfirmModal(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <Loading />
      </div>
    );
  }

  return (
    <>
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
                        w-full h-full flex items-center justify-center text-3xl font-bold 
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

                {/* CAMERA ICON */}
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
                  // save
                  <button
                    onClick={handleEditProfile}
                    disabled={profileLoading}
                    className="
                      px-5 py-2 rounded-lg text-sm font-semibold text-white
                      bg-neutral-900
                      transform transition-all duration-200
                      hover:-translate-y-0.5
                      active:translate-y-1
                      shadow-[0_6px_0_0_rgba(10,10,10,1)]
                      hover:shadow-[0_8px_0_0_rgba(10,10,10,1)]
                      active:shadow-[0_3px_0_0_rgba(10,10,10,1)]
                    "
                  >
                    {profileLoading ? (
                      <svg
                        className="animate-spin w-4 h-4 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Save"
                    )}
                  </button>
                ) : (
                  <>
                    {/* edit */}
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-5 py-2 rounded-lg border text-sm"
                    >
                      Edit Profile
                    </button>

                    {/* logout */}
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className="px-5 py-2 text-neutral-200 bg-red-700 hover:bg-red-800 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutLoading ? "Logging out..." : "Logout"}
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
            }`}
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

      {/* Logout Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/40"
            onClick={() => setShowConfirmModal(false)}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-gray-100 dark:border-zinc-700"
          >
            <div className="text-center">
              {/* User Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 p-4">
                <svg
                  className="w-12 h-12 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Log out ?
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to <br /> logout ?
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  disabled={logoutLoading}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {logoutLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Logging out...
                    </>
                  ) : (
                    "Yes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Delete Pin Confirmation Modal */}
      {showDeletePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/40"
            onClick={() => setShowDeletePinModal(false)}
          />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 border border-gray-100 dark:border-zinc-700"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 p-4">
                <FaTrash className="w-10 h-10 text-rose-600" />
              </div>

              <h2 className="text-2xl font-bold dark:text-zinc-300 mb-3">
                Delete Pin ?
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-8">
                This pin will be permanently deleted.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeletePinModal(false)}
                  disabled={deleteLoading}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-300 px-6 py-3 rounded-2xl font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeletePinConfirm}
                  disabled={deleteLoading}
                  className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 text-white px-6 py-3 rounded-2xl font-semibold"
                >
                  {deleteLoading ? "Deleting..." : "Yes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Account;
