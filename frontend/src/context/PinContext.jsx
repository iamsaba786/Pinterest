import axios from "axios";
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
  const [loading, setLoading] = useState(false); // ✅ false initially
  const [pin, setPin] = useState(null);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // ✅ FIXED: No dependencies = No infinite loop!
  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://pinterest-sve7.onrender.com/api/pin/all",
        getAuthHeader()
      );
      setPins(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch pins error:", error);
      setPins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 EMERGENCY FIX: EMPTY DEPENDENCIES!
  const fetchPin = useCallback(async (id) => {
    if (!id) {
      setPin(null);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://pinterest-sve7.onrender.com/api/pin/${id}`,
        getAuthHeader()
      );
      setPin(data);
    } catch (error) {
      console.error("Fetch pin error:", error);
      setPin(null);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ NO DEPENDENCIES = NO INFINITE LOOP!

  const addPin = useCallback(
    async (
      formData,
      setFilePrev,
      setFile,
      setTitle,
      setPinContent,
      navigate
    ) => {
      try {
        const { data } = await axios.post(
          "https://pinterest-sve7.onrender.com/api/pin/new",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
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
    [fetchPins]
  );

  // ✅ SAFE useEffect - Won't infinite loop
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
          const { data } = await axios.put(
            `/api/pin/${id}`,
            { title, pin: pinContent },
            getAuthHeader()
          );
          toast.success(data.message);
          await fetchPin(id);
          setEdit(false);
        } catch (error) {
          toast.error(error.response?.data?.message || "Update failed");
        }
      },
      [fetchPin]
    ),
    addComment: useCallback(
      async (id, comment, setComment) => {
        try {
          const { data } = await axios.post(
            `https://pinterest-sve7.onrender.com/api/pin/comment/${id}`,
            { comment },
            getAuthHeader()
          );
          toast.success(data.message);
          await fetchPin(id);
          setComment("");
        } catch (error) {
          toast.error(error.response?.data?.message || "Comment failed");
        }
      },
      [fetchPin]
    ),
    deleteComment: useCallback(
      async (id, commentId) => {
        try {
          const { data } = await axios.delete(
            `https://pinterest-sve7.onrender.com/api/pin/comment/${id}?commentId=${commentId}`,
            getAuthHeader()
          );
          toast.success(data.message);
          await fetchPin(id);
        } catch (error) {
          toast.error(error.response?.data?.message || "Delete failed");
        }
      },
      [fetchPin]
    ),
    deletePin: useCallback(
      async (id, navigate) => {
        try {
          setLoading(true);
          const { data } = await axios.delete(
            `/api/pin/${id}`,
            getAuthHeader()
          );
          toast.success(data.message);
          await fetchPins();
          navigate?.("/");
        } catch (error) {
          toast.error(error.response?.data?.message || "Delete failed");
        } finally {
          setLoading(false);
        }
      },
      [fetchPins]
    ),
  };

  return <PinContext.Provider value={value}>{children}</PinContext.Provider>;
};

export const PinData = () => useContext(PinContext);
