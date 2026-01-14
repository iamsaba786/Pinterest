import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/UserContext";
import { Loading } from "../components/Loading";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const PinPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading: pinLoading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    deleteComment,
    deletePin,
  } = PinData();
  const { user, loading: userLoading, darkMode } = UserData(); // ✅ darkMode added

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [comment, setComment] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setPageLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        await fetchPin(id);
      } catch (error) {
        console.error("Pin fetch failed:", error);
      } finally {
        setTimeout(() => setPageLoading(false), 5000);
      }
    };

    fetchData();
  }, [id, fetchPin]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ LOADING
  if (pageLoading || userLoading || pinLoading) {
    return (
      <div
        className={`
        min-h-screen pt-20 flex items-center justify-center
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
            : "bg-gradient-to-br from-white to-red-50"
        }
      `}
      >
        <div className="text-center">
          <Loading />
          <p
            className={`
            mt-4 text-lg transition-colors
            ${darkMode ? "text-zinc-400" : "text-gray-600"}
          `}
          >
            Loading pin...
          </p>
        </div>
      </div>
    );
  }

  // ✅ PIN NOT FOUND
  if (!pin?._id || !pin?.title) {
    return (
      <div
        className={`
        min-h-screen pt-20 flex flex-col items-center justify-center px-4
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
            : "bg-gradient-to-br from-white to-red-50"
        }
      `}
      >
        <div
          className={`
          text-center max-w-md p-12 rounded-3xl shadow-2xl backdrop-blur-xl transition-all
          ${
            darkMode
              ? "bg-zinc-900/80 border border-zinc-700/50 shadow-zinc-500/10"
              : "bg-white/80 border border-white/50 shadow-2xl"
          }
        `}
        >
          <div
            className={`
            w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-colors
            ${
              darkMode
                ? "bg-zinc-800 text-zinc-500"
                : "bg-gray-200 text-gray-500"
            }
          `}
          >
            <span className="text-2xl">📎</span>
          </div>
          <h2
            className={`
            text-3xl font-bold mb-4 transition-colors
            ${darkMode ? "text-zinc-100" : "text-gray-800"}
          `}
          >
            Pin Not Found
          </h2>
          <p
            className={`
            text-lg mb-8 transition-colors
            ${darkMode ? "text-zinc-400" : "text-gray-600"}
          `}
          >
            This pin doesn't exist or was deleted.
          </p>
          <div className="space-x-4">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-block"
            >
              Back to Home
            </Link>
            <button
              onClick={() => navigate(-1)}
              className={`
                px-8 py-4 font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl
                ${
                  darkMode
                    ? "border-2 border-zinc-600 hover:border-zinc-500 text-zinc-200 bg-zinc-800/50 hover:bg-zinc-700/50"
                    : "border-2 border-gray-300 hover:border-gray-400 text-gray-700 bg-white hover:bg-gray-50"
                }
              `}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ NO USER
  if (!user) {
    return (
      <div
        className={`
        min-h-screen pt-20 flex items-center justify-center px-4
        ${
          darkMode
            ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
            : "bg-gradient-to-br from-white to-red-50"
        }
      `}
      >
        <div
          className={`
          text-center max-w-md p-12 rounded-3xl shadow-2xl backdrop-blur-xl transition-all
          ${
            darkMode
              ? "bg-zinc-900/80 border border-zinc-700/50 shadow-zinc-500/10"
              : "bg-white/80 border border-white/50 shadow-2xl"
          }
        `}
        >
          <h2
            className={`
            text-3xl font-bold mb-6 transition-colors
            ${darkMode ? "text-zinc-100" : "text-gray-800"}
          `}
          >
            Login Required
          </h2>
          <p
            className={`
            text-lg mb-8 transition-colors
            ${darkMode ? "text-zinc-400" : "text-gray-600"}
          `}
          >
            Please login to view this pin
          </p>
          <Link
            to="/login"
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ✅ HANDLERS
  const editHandler = () => {
    setTitle(pin.title || "");
    setPinValue(pin.pin || "");
    setEdit(true);
  };

  const updateHandler = () => {
    if (title.trim() && pinValue.trim()) {
      updatePin(pin._id, title, pinValue, setEdit);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(pin._id, comment, setComment);
    }
  };

  const deleteCommentHandler = (commentId) => {
    if (confirm("Delete this comment?")) {
      deleteComment(pin._id, commentId);
    }
  };

  const deletePinHandler = () => {
    if (confirm("Delete this pin forever?")) {
      deletePin(pin._id, navigate);
    }
  };

  return (
    <div
      className={`
      min-h-screen pt-20 transition-colors duration-300
      ${
        darkMode
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-zinc-100"
          : "bg-gradient-to-br from-white via-red-50 to-pink-50 text-gray-900"
      }
    `}
    >
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div
          className={`
          backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto border transition-all duration-300
          ${
            darkMode
              ? "bg-zinc-900/90 border-zinc-700/50 shadow-zinc-500/20 hover:shadow-zinc-400/30"
              : "bg-white/90 border-white/50 shadow-2xl hover:shadow-3xl"
          }
        `}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-0">
            {/* IMAGE */}
            <div
              className={`
              relative h-[400px] xl:h-[500px] overflow-hidden transition-colors
              ${
                darkMode
                  ? "bg-gradient-to-br from-zinc-800 to-zinc-700"
                  : "bg-gradient-to-br from-gray-50 to-gray-100"
              }
            `}
            >
              {pin.image?.url ? (
                <img
                  src={pin.image.url}
                  alt={pin.title}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`
                  w-full h-full flex items-center justify-center transition-colors
                  ${
                    darkMode
                      ? "bg-gradient-to-br from-zinc-800 to-zinc-700 text-zinc-500"
                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500"
                  }
                `}
                >
                  <span className="text-2xl">No Image</span>
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-6 lg:p-10 xl:p-12 space-y-6">
              {/* TITLE + ACTIONS */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {edit ? (
                    <>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`
                          w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-offset-0 text-2xl font-bold mb-4 transition-all
                          ${
                            darkMode
                              ? "bg-zinc-800/50 border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-400/30"
                              : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
                          }
                        `}
                        placeholder="Pin title"
                      />
                      <textarea
                        value={pinValue}
                        onChange={(e) => setPinValue(e.target.value)}
                        className={`
                          w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-offset-0 text-lg transition-all
                          ${
                            darkMode
                              ? "bg-zinc-800/50 border-zinc-600 text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-400/30"
                              : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-red-400 focus:ring-red-400/20"
                          }
                        `}
                        rows="4"
                        placeholder="Description"
                      />
                    </>
                  ) : (
                    <>
                      <h1
                        className={`
                        text-3xl lg:text-4xl font-black mb-4 leading-tight transition-colors
                        ${
                          darkMode
                            ? "text-zinc-100 drop-shadow-lg"
                            : "text-gray-900"
                        }
                      `}
                      >
                        {pin.title}
                      </h1>
                      <p
                        className={`
                        text-xl leading-relaxed max-w-2xl transition-colors
                        ${darkMode ? "text-zinc-300" : "text-gray-700"}
                      `}
                      >
                        {pin.pin}
                      </p>
                    </>
                  )}
                </div>

                {user._id === pin.owner?._id && (
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-2">
                    <button
                      onClick={editHandler}
                      className={`
                        p-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 min-w-[120px] font-medium transform hover:-translate-y-0.5
                        ${
                          darkMode
                            ? "bg-zinc-600 hover:bg-zinc-500 text-zinc-100 shadow-zinc-400/25"
                            : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-400/25"
                        }
                      `}
                    >
                      <FaEdit className="w-5 h-5 inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={deletePinHandler}
                      className={`
                        p-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex-1 min-w-[120px] font-medium transform hover:-translate-y-0.5
                        ${
                          darkMode
                            ? "bg-rose-600 hover:bg-rose-500 text-zinc-100 shadow-rose-500/25"
                            : "bg-red-500 hover:bg-red-600 text-white shadow-red-400/25"
                        }
                      `}
                    >
                      <MdDelete className="w-5 h-5 inline mr-2" />
                      Delete
                    </button>
                    {edit && (
                      <button
                        onClick={updateHandler}
                        className={`
                          px-6 py-3 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5
                          ${
                            darkMode
                              ? "bg-emerald-600 hover:bg-emerald-500 text-zinc-100 shadow-emerald-500/25"
                              : "bg-green-500 hover:bg-green-600 text-white shadow-green-400/25"
                          }
                        `}
                      >
                        Update Pin
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* OWNER */}
              {pin.owner && (
                <Link
                  to={`/user/${pin.owner._id}`}
                  className={`
                    flex items-center p-4 rounded-2xl transition-all group hover:shadow-xl hover:-translate-y-1
                    ${
                      darkMode
                        ? "bg-zinc-800/50 hover:bg-zinc-700/70 border border-zinc-700/50"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-100"
                    }
                  `}
                >
                  <div
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform
                    ${
                      darkMode
                        ? "bg-gradient-to-r from-zinc-600 to-zinc-500 shadow-zinc-400/25"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-400/25"
                    }
                  `}
                  >
                    <span className="font-bold text-white text-sm">
                      {pin.owner.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`
                      font-bold text-lg group-hover:text-red-500 transition-colors
                      ${
                        darkMode
                          ? "text-zinc-200 hover:text-rose-400"
                          : "text-gray-900"
                      }
                    `}
                    >
                      {pin.owner.name}
                    </h3>
                    <p
                      className={`
                      text-sm transition-colors
                      ${darkMode ? "text-zinc-500" : "text-gray-600"}
                    `}
                    >
                      {pin.owner.followers?.length || 0} followers
                    </p>
                  </div>
                </Link>
              )}

              {/* COMMENT FORM */}
              <form
                onSubmit={submitHandler}
                className={`
                  flex gap-3 p-6 rounded-3xl items-end transition-all
                  ${
                    darkMode
                      ? "bg-zinc-800/50 border border-zinc-700/50"
                      : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-100/50"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center flex-1 rounded-2xl shadow-sm border p-4 transition-all
                  ${
                    darkMode
                      ? "bg-zinc-900/50 border-zinc-600 hover:border-zinc-500"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }
                `}
                >
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-md transition-all
                    ${
                      darkMode
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-400/25"
                        : "bg-gradient-to-r from-red-400 to-pink-400 shadow-red-300/25"
                    }
                  `}
                  >
                    <span className="font-bold text-white text-sm">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comment..."
                    className={`
                      flex-1 bg-transparent border-none outline-none text-lg placeholder-zinc-500 transition-colors
                      ${
                        darkMode
                          ? "text-zinc-200 placeholder-zinc-500"
                          : "text-gray-900 placeholder-gray-500"
                      }
                    `}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className={`
                    px-8 py-4 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all whitespace-nowrap flex-shrink-0 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      darkMode
                        ? "bg-gradient-to-r from-zinc-600 to-zinc-500 hover:from-zinc-500 hover:to-zinc-400 text-zinc-900 shadow-zinc-400/25 ring-2 ring-zinc-500/20"
                        : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-400/25 ring-2 ring-red-500/20"
                    }
                  `}
                >
                  Comment
                </button>
              </form>

              {/* COMMENTS */}
              <div className="space-y-1">
                <h3
                  className={`
                  text-2xl font-bold mb-6 transition-colors
                  ${darkMode ? "text-zinc-100 drop-shadow-lg" : "text-gray-900"}
                `}
                >
                  Comments ({pin.comments?.length || 0})
                </h3>
                {pin.comments?.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                    {pin.comments.map((commentItem, index) => (
                      <div
                        key={commentItem._id || index}
                        className={`
                          flex items-start gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border backdrop-blur-sm
                          ${
                            darkMode
                              ? "bg-zinc-800/60 hover:bg-zinc-700/70 border-zinc-700/50 shadow-zinc-400/10"
                              : "bg-white/60 hover:bg-white/80 border-gray-100 shadow-gray-100/50"
                          }
                        `}
                      >
                        <Link
                          to={`/user/${commentItem.user}`}
                          className="shrink-0"
                        >
                          <div
                            className={`
                            w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform
                            ${
                              darkMode
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-400/25"
                                : "bg-gradient-to-r from-blue-400 to-indigo-400 shadow-blue-300/25"
                            }
                          `}
                          >
                            <span className="font-bold text-white text-xs">
                              {commentItem.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Link
                              to={`/user/${commentItem.user}`}
                              className={`
                                font-semibold text-sm transition-colors hover:text-red-500
                                ${
                                  darkMode
                                    ? "text-zinc-200 hover:text-rose-400"
                                    : "text-gray-900"
                                }
                              `}
                            >
                              {commentItem.name}
                            </Link>
                          </div>
                          <p
                            className={`
                            leading-relaxed transition-colors
                            ${darkMode ? "text-zinc-300" : "text-gray-700"}
                          `}
                          >
                            {commentItem.comment}
                          </p>
                        </div>
                        {commentItem.user === user._id && (
                          <button
                            onClick={() =>
                              deleteCommentHandler(commentItem._id)
                            }
                            className={`
                              p-2 rounded-xl shadow-md hover:shadow-lg transition-all ml-2 shrink-0 transform hover:-translate-y-0.5
                              ${
                                darkMode
                                  ? "bg-rose-600 hover:bg-rose-500 text-zinc-100 shadow-rose-400/25"
                                  : "bg-red-500 hover:bg-red-600 text-white shadow-red-300/25"
                              }
                            `}
                            title="Delete comment"
                          >
                            <MdDelete className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`
                    text-center py-12 rounded-2xl border-2 border-dashed transition-all
                    ${
                      darkMode
                        ? "bg-zinc-800/30 border-zinc-700/50 text-zinc-400"
                        : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-500"
                    }
                  `}
                  >
                    <p className="text-xl font-medium mb-2">No comments yet</p>
                    <p
                      className={`
                      ${darkMode ? "text-zinc-500" : "text-gray-400"}
                    `}
                    >
                      Be the first to comment!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinPage;
