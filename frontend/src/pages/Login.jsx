import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { LoadingAnimation } from "../components/Loading";
import { PinData } from "../context/PinContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser, btnLoading, darkMode } = UserData(); // ✅ darkMode added
  const navigate = useNavigate();
  const { fetchPins } = PinData();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchPins);
  };

  return (
    <div
      className={`
      min-h-screen pt-12 flex items-center justify-center transition-colors duration-300
      ${
        darkMode
          ? "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black"
          : "bg-gray-100"
      }
    `}
    >
      <div
        className={`
        p-8 rounded-3xl w-full max-w-md shadow-2xl backdrop-blur-xl border transition-all duration-300
        ${
          darkMode
            ? "bg-zinc-900/80 border-zinc-700/50 shadow-zinc-500/10 hover:shadow-zinc-400/20"
            : "bg-white/70 border-gray-200/50 shadow-lg hover:shadow-xl"
        }
      `}
      >
        {/* Pinterest Logo */}
        <div className="flex justify-center mb-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png"
            alt="Pinterest"
            className="h-10 filter drop-shadow-lg"
          />
        </div>

        {/* Title */}
        <h2
          className={`
          text-2xl font-bold text-center mb-4 transition-colors
          ${darkMode ? "text-zinc-100" : "text-gray-900"}
        `}
        >
          Log in to see more
        </h2>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className={`
                block text-sm font-semibold mb-2 transition-colors
                ${darkMode ? "text-zinc-300" : "text-gray-700"}
              `}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`
                w-full px-4 py-3 rounded-2xl border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-0
                ${
                  darkMode
                    ? "border-zinc-600 bg-zinc-800/50 text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-500/30"
                    : "border-gray-200 bg-white/50 text-gray-900 placeholder-gray-500 focus:border-red-300 focus:ring-red-400/20"
                }
                ${email ? "ring-2 ring-offset-0 ring-blue-400/30" : ""}
              `}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className={`
                block text-sm font-semibold mb-2 transition-colors
                ${darkMode ? "text-zinc-300" : "text-gray-700"}
              `}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`
                w-full px-4 py-3 rounded-2xl border-2 bg-transparent transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-0
                ${
                  darkMode
                    ? "border-zinc-600 bg-zinc-800/50 text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 focus:ring-zinc-500/30"
                    : "border-gray-200 bg-white/50 text-gray-900 placeholder-gray-500 focus:border-red-300 focus:ring-red-400/20"
                }
                ${password ? "ring-2 ring-offset-0 ring-blue-400/30" : ""}
              `}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`
    w-full py-2 px-6 rounded-xl font-bold text-lg
    flex items-center justify-center gap-2
    transition-all duration-200
    bg-red-800 text-zinc-200 
    shadow-[0_6px_0_#7f1d1d]
    active:translate-y-1 active:shadow-none
    ${
      btnLoading
        ? "opacity-80 cursor-not-allowed active:translate-y-0 active:shadow-[0_6px_0_#5f0000]"
        : ""
    }
  `}
            disabled={btnLoading}
          >
            {btnLoading ? <LoadingAnimation /> : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`
                w-full h-px
                ${darkMode ? "bg-zinc-700" : "bg-gray-300"}
              `}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`
                px-3 py-1 rounded-full font-semibold tracking-wide
                ${
                  darkMode
                    ? "bg-zinc-900 text-zinc-400"
                    : "bg-white text-gray-500"
                }
              `}
              >
                OR
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span
              className={`
              text-sm transition-colors
              ${darkMode ? "text-zinc-400" : "text-gray-600"}
            `}
            >
              Not on Pinterest yet?{" "}
              <Link
                to="/register"
                className={`
                  font-bold hover:underline transition-all duration-200
                  ${
                    darkMode
                      ? "text-rose-400 hover:text-rose-300"
                      : "text-red-600 hover:text-red-700"
                  }
                `}
              >
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
