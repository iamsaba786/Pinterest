import React, { useRef, useState, useEffect } from "react";
import { PinData } from "../context/PinContext";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { addPin } = PinData();
  const { user, loading, darkMode } = UserData();

  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 👉 One-time intro screen
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("create-intro-seen");
    if (!visited) setShowIntro(true);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("create-intro-seen", "true");
    setShowIntro(false);
  };

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setFilePrev(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const addPinHandler = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return alert("Image & title required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("pin", description);
    formData.append("image", file);

    await addPin(
      formData,
      setFilePrev,
      setFile,
      setTitle,
      setDescription,
      navigate
    );
  };

  if (loading || !user) return null;

  /* ---------------- INTRO SCREEN ---------------- */
  if (showIntro) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-6
        ${darkMode ? "bg-zinc-900 text-zinc-100" : "bg-white text-gray-900"}`}
      >
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Where your content can thrive
          </h1>
          <p className="text-lg opacity-70">
            Create pins effortlessly and grow your ideas in a positive space.
          </p>

          <button
            onClick={handleGetStarted}
            className="px-10 py-4 rounded-full font-semibold bg-black text-white hover:scale-105 transition"
          >
            Get started
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN CREATE PAGE ---------------- */
  return (
    <div
      className={`min-h-screen pt-24 px-10
      ${darkMode ? "bg-zinc-950 text-zinc-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* LEFT – IMAGE UPLOAD */}
        <div
          onClick={() => inputRef.current.click()}
          className={`h-[480px] rounded-2xl border flex items-center justify-center cursor-pointer
          ${
            darkMode
              ? "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
              : "border-gray-300 bg-white hover:border-gray-500"
          }`}
        >
          {filePrev ? (
            <img
              src={filePrev}
              className="w-full h-full object-cover rounded-2xl"
              alt="preview"
            />
          ) : (
            <span className="text-sm opacity-60">Click to upload image</span>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={changeFileHandler}
          />
        </div>

        {/* RIGHT – FORM */}
        <form onSubmit={addPinHandler} className="space-y-10">
          <div>
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-4 rounded-xl border focus:outline-none
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700"
                  : "bg-white border-gray-300"
              }`}
              placeholder="Add a title"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              rows="6"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-4 rounded-xl border resize-none focus:outline-none
              ${
                darkMode
                  ? "bg-zinc-900 border-zinc-700"
                  : "bg-white border-gray-300"
              }`}
              placeholder="Tell everyone about your pin"
            />
          </div>

          {/* 3D BUTTON */}
          <button
            type="submit"
            className="relative px-12 py-4 rounded-full font-semibold
            bg-white text-black shadow-[0_8px_0_#ccc] 
            active:translate-y-2 active:shadow-none transition"
          >
            Create Pin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
