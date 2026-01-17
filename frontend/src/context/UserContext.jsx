import { createContext, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import api from "../utils/axios.js";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // ✅ logout - SIMPLIFIED
  const logout = async () => {
    try {
      await api.get("/user/logout"); // 👈 FIXED
      setUser(null);
      setIsAuth(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ✅ toggleDarkMode same
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // ✅ registerUser - SIMPLIFIED
  async function registerUser(name, email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await api.post("/user/register", {
        // 👈 FIXED
        name,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setBtnLoading(false);
    }
  }

  // ✅ loginUser - SIMPLIFIED
  async function loginUser(email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await api.post("/user/login", { email, password }); // 👈 FIXED
      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins?.();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      setBtnLoading(false);
    }
  }

  // ✅ fetchUser - SIMPLIFIED
  async function fetchUser() {
    try {
      const { data } = await api.get("/user/me"); // 👈 FIXED (No headers needed!)
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // ✅ followUser - SIMPLIFIED
  async function followUser(id, fetchUser) {
    try {
      const { data } = await api.post(`/user/follow/${id}`, {}); // 👈 FIXED
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        user,
        loading,
        registerUser,
        setIsAuth,
        setUser,
        followUser,
        logout,
        darkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
