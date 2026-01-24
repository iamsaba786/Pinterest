import api from "../utils/axios.js";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/UserContext";
import PinCard from "../components/PinCard";
import { Loading } from "../components/Loading";

const UserProfile = () => {
  const params = useParams();
  const {
    user: loggedInUser,
    followUser,
    loading: userLoading,
    darkMode,
  } = UserData();
  const { pins, loading: pinsLoading } = PinData();

  const [profileUser, setProfileUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isFollow, setIsFollow] = useState(false);

  // ✅ SAFE fetchUser
  const fetchUser = useCallback(async () => {
    if (!params.id) return;
    try {
      setProfileLoading(true);
      const { data } = await api.get(`/user/${params.id}`);
      setProfileUser(data);

      if (loggedInUser?._id && data.followers?.includes(loggedInUser._id)) {
        setIsFollow(true);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      setProfileUser(null);
    } finally {
      setProfileLoading(false);
    }
  }, [params.id, loggedInUser?._id]);

  const followHandler = async () => {
    if (!profileUser?._id || !loggedInUser?._id) return;

    try {
      await followUser(profileUser._id, fetchUser);
      setIsFollow(!isFollow);
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const userPins = React.useMemo(() => {
    if (!Array.isArray(pins) || !profileUser?._id) return [];
    return pins.filter((pin) => pin.owner === profileUser._id);
  }, [pins, profileUser?._id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ PERFECT DARK MODE LOADING
  if (userLoading || profileLoading || pinsLoading) {
    return (
      <div
        className={`
        min-h-screen pt-4 sm:pt-8 md:pt-12 lg:pt-20 flex items-center justify-center px-4
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
            : "bg-gradient-to-br from-white to-red-50"
        }
      `}
      >
        <Loading />
      </div>
    );
  }

  // ✅ User not found
  if (!profileUser?._id) {
    return (
      <div
        className={`
        min-h-screen pt-4 sm:pt-8 md:pt-12 lg:pt-20 flex items-center justify-center px-4
        ${darkMode ? "bg-black" : "bg-gradient-to-br from-white to-red-50"}
      `}
      >
        <div className="text-center p-8 sm:p-12 max-w-md w-full mx-4">
          <h2
            className={`
            text-2xl sm:text-3xl font-bold mb-6 
            ${darkMode ? "text-zinc-100" : "text-gray-800"}
          `}
          >
            User Not Found
          </h2>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-xl hover:shadow-2xl inline-block text-sm sm:text-base"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Not logged in
  if (!loggedInUser) {
    return (
      <div
        className={`
        min-h-screen pt-4 sm:pt-8 md:pt-12 lg:pt-20 flex items-center justify-center px-4
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
            : "bg-gradient-to-br from-white to-red-50"
        }
      `}
      >
        <div className="text-center p-8 sm:p-12 max-w-md w-full mx-4">
          <h2
            className={`
            text-xl sm:text-2xl font-bold mb-6 
            ${darkMode ? "text-zinc-100" : "text-gray-900"}
          `}
          >
            Please login to view profiles
          </h2>
          <Link
            to="/login"
            className={`
              ${
                darkMode
                  ? "text-rose-400 hover:text-rose-300"
                  : "text-red-500 hover:text-red-600"
              } font-semibold hover:underline transition-colors text-sm sm:text-base
            `}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
      min-h-screen pt-4 sm:pt-6 md:pt-8 lg:pt-20 transition-colors duration-300
      ${
        darkMode
          ? "bg-zinc-900 text-zinc-100"
          : "bg-gradient-to-br from-white to-red-50 text-gray-900"
      }
    `}
    >
      <div className="max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          {/* Profile Picture */}
          <div
            className={`
            w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-6 sm:mb-8 rounded-full p-1 sm:p-2 shadow-2xl transition-all duration-300
            ${
              darkMode
                ? "bg-gradient-to-br from-zinc-700 to-zinc-600 shadow-zinc-500/25 ring-4 ring-zinc-800/50"
                : "bg-gradient-to-br from-purple-400 to-pink-500 shadow-purple-500/25 ring-4 ring-white/50"
            }
          `}
          >
            {profileUser.profilePic?.url ? (
              <img
                src={profileUser.profilePic.url}
                alt={profileUser.name}
                className="w-full h-full rounded-full object-cover shadow-2xl"
              />
            ) : (
              <div
                className={`
                w-full h-full rounded-full flex items-center justify-center shadow-xl font-bold text-2xl sm:text-3xl transition-colors
                ${
                  darkMode
                    ? "bg-gradient-to-br from-zinc-600 to-zinc-500 text-zinc-100 shadow-zinc-400/25"
                    : "bg-gradient-to-br from-white to-gray-100 text-gray-800 shadow-gray-200/25"
                }
              `}
              >
                {profileUser.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <h1
            className={`
            text-3xl sm:text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r bg-clip-text text-transparent transition-all
            ${
              darkMode
                ? "from-zinc-200 via-zinc-100 to-white"
                : "from-gray-900 to-gray-600"
            }
          `}
          >
            {profileUser.name}
          </h1>
          <p
            className={`
            text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 transition-colors
            ${darkMode ? "text-zinc-300" : "text-gray-600"}
          `}
          >
            {profileUser.email}
          </p>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-12 items-center">
            <div
              className={`
              p-3 sm:p-4 md:p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 flex-1 max-w-xs text-center
              ${
                darkMode
                  ? "bg-zinc-800/50 shadow-zinc-500/10 hover:bg-zinc-700/70 border border-zinc-700/50"
                  : "bg-white/70 shadow-lg hover:bg-white border border-rose-100/50"
              }
            `}
            >
              <span
                className={`
                font-bold text-2xl sm:text-3xl block
                ${darkMode ? "text-zinc-100" : "text-gray-900"}
              `}
              >
                {userPins.length}
              </span>
              <p
                className={`
                text-xs sm:text-sm uppercase tracking-wide font-semibold mt-1
                ${darkMode ? "text-zinc-400" : "text-gray-600"}
              `}
              >
                Pins
              </p>
            </div>
            <div
              className={`
              p-3 sm:p-4 md:p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 flex-1 max-w-xs text-center
              ${
                darkMode
                  ? "bg-zinc-800/50 shadow-zinc-500/10 hover:bg-zinc-700/70 border border-zinc-700/50"
                  : "bg-white/70 shadow-lg hover:bg-white border border-rose-100/50"
              }
            `}
            >
              <span
                className={`
                font-bold text-2xl sm:text-3xl block
                ${darkMode ? "text-zinc-100" : "text-gray-900"}
              `}
              >
                {profileUser.followers?.length || 0}
              </span>
              <p
                className={`
                text-xs sm:text-sm uppercase tracking-wide font-semibold mt-1
                ${darkMode ? "text-zinc-400" : "text-gray-600"}
              `}
              >
                Followers
              </p>
            </div>
            <div
              className={`
              p-3 sm:p-4 md:p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 flex-1 max-w-xs text-center
              ${
                darkMode
                  ? "bg-zinc-800/50 shadow-zinc-500/10 hover:bg-zinc-700/70 border border-zinc-700/50"
                  : "bg-white/70 shadow-lg hover:bg-white border border-rose-100/50"
              }
            `}
            >
              <span
                className={`
                font-bold text-2xl sm:text-3xl block
                ${darkMode ? "text-zinc-100" : "text-gray-900"}
              `}
              >
                {profileUser.following?.length || 0}
              </span>
              <p
                className={`
                text-xs sm:text-sm uppercase tracking-wide font-semibold mt-1
                ${darkMode ? "text-zinc-400" : "text-gray-600"}
              `}
              >
                Following
              </p>
            </div>
          </div>

          {/* Follow Button */}
          {profileUser._id !== loggedInUser._id && (
            <button
              onClick={followHandler}
              className={`
                px-6 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto max-w-xs mx-auto
                ${
                  isFollow
                    ? "bg-red-700 hover:bg-red-800 text-white"
                    : "bg-red-700 hover:bg-red-800 text-white"
                }
              `}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          )}
        </div>

        {/* User Pins */}
        <div>
          <h2
            className={`
            text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r bg-clip-text text-transparent transition-all
            ${
              darkMode
                ? "from-zinc-200 via-zinc-100 to-white drop-shadow-lg"
                : "from-gray-800 to-black"
            }
          `}
          >
            {profileUser.name}'s Pins
          </h2>

          {userPins.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {userPins.map((pin) => (
                <PinCard key={pin._id} pin={pin} />
              ))}
            </div>
          ) : (
            <div
              className={`
              text-center py-12 sm:py-20 transition-colors max-w-md mx-auto
              ${darkMode ? "text-zinc-400" : "text-gray-500"}
            `}
            >
              <div
                className={`
                w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 opacity-40 transition-colors
                ${darkMode ? "text-zinc-600" : "text-gray-400"}
              `}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  className="w-full h-full"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
              <h3
                className={`
                text-xl sm:text-2xl font-bold mb-4 transition-colors
                ${darkMode ? "text-zinc-300" : "text-gray-600"}
              `}
              >
                No pins yet
              </h3>
              <p className="text-base sm:text-lg">
                {profileUser._id === loggedInUser._id
                  ? "Create your first pin!"
                  : `${profileUser.name} hasn't created any pins yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
