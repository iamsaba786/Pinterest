import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ✅ null instead of []
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    // Load from localStorage on first render
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });

  // ✅ Added logout function
  const logout = async () => {
    try {
      await axios.get("/api/user/logout");
      setUser(null);
      setIsAuth(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ✅ Added toggleDarkMode function
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  async function registerUser(name, email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
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

  async function loginUser(email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

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

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function followUser(id, fetchUser) {
    try {
      const { data } = await axios.post(
        `/api/user/follow/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
        logout, // ✅ Added
        darkMode, // ✅ Added
        toggleDarkMode, // ✅ Added
        searchQuery,
        setSearchQuery, // ✅ Added
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
