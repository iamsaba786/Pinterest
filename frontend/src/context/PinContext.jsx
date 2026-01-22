import api from "../utils/axios.js"; // 👈 YE ADD KARO (Line 1)
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(null);

  // ✅ fetchPins - api use kiya
  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/pin/all"); // 👈 SIMPLIFIED
      setPins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch pins error:", error);
      setPins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ fetchPin - api use kiya
  const fetchPin = useCallback(async (id) => {
    if (!id) {
      setPin(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(`/pin/${id}`); // 👈 SIMPLIFIED
      setPin(data);
    } catch (error) {
      console.error("Fetch pin error:", error);
      setPin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ addPin - apiUpload use kiya
  const addPin = useCallback(
    async (
      formData,
      setFilePrev,
      setFile,
      setTitle,
      setPinContent,
      navigate,
    ) => {
      try {
        const { data } = await api.post("/pin/new", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(data.message);
        setFilePrev?.("");
        setFile?.(null);
        setTitle?.("");
        setPinContent?.("");
        await fetchPins();
        navigate?.("/");
      } catch (error) {
        toast.error(error.response?.data?.message || "Pin creation failed");
      }
    },
    [fetchPins],
  );

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const value = {
    pins,
    loading,
    pin,
    fetchPin,
    fetchPins,
    addPin,
    updatePin: useCallback(
      async (id, title, pinContent, setEdit) => {
        try {
          const { data } = await api.put(`/pin/${id}`, {
            title,
            pin: pinContent,
          }); // 👈 FIXED
          toast.success(data.message);
          await fetchPin(id);
          setEdit(false);
        } catch (error) {
          toast.error(error.response?.data?.message || "Update failed");
        }
      },
      [fetchPin],
    ),
    addComment: useCallback(
      async (id, comment, setComment) => {
        try {
          const { data } = await api.post(`/pin/comment/${id}`, { comment }); // 👈 FIXED
          toast.success(data.message);
          await fetchPin(id);
          setComment("");
        } catch (error) {
          toast.error(error.response?.data?.message || "Comment failed");
        }
      },
      [fetchPin],
    ),
    deleteComment: useCallback(
      async (id, commentId) => {
        try {
          const { data } = await api.delete(
            `/pin/comment/${id}?commentId=${commentId}`,
          ); // 👈 FIXED
          toast.success(data.message);
          await fetchPin(id);
        } catch (error) {
          toast.error(error.response?.data?.message || "Delete failed");
        }
      },
      [fetchPin],
    ),
    deletePin: useCallback(
      async (id, navigate) => {
        try {
          setLoading(true);
          const { data } = await api.delete(`/pin/${id}`); // 👈 FIXED
          toast.success(data.message);
          await fetchPins();
          navigate?.("/");
        } catch (error) {
          toast.error(error.response?.data?.message || "Delete failed");
        } finally {
          setLoading(false);
        }
      },
      [fetchPins],
    ),
  };

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

export const PinData = () => useContext(PinContext);
