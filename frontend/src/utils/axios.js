import axios from "axios";

// Environment-aware baseURL
const baseURL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://pinterest-sve7.onrender.com/api";

// Main API instance (JWT cookies auto)
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload API (multipart files)
export const apiUpload = axios.create({
  baseURL,
  withCredentials: true,
});

// Request interceptor (loading, auth)
api.interceptors.request.use(
  (config) => {
    // Future: Loading spinner global
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (errors handle)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on 401
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post("/user/login", data),
  register: (data) => api.post("/user/register", data),
  logout: () => api.get("/user/logout"),
  profile: () => api.get("/user/me"),
  updateProfile: (formData) => apiUpload.put("/user/update", formData),
  follow: (userId) => api.post(`/user/follow/${userId}`),
};

// Pin APIs
export const pinAPI = {
  create: (formData) => apiUpload.post("/pin/new", formData),
  all: (query = "") => api.get(`/pin/all${query}`),
  single: (id) => api.get(`/pin/${id}`),
  comment: (id, comment) => api.post(`/pin/comment/${id}`, { comment }),
  deleteComment: (id, commentId) =>
    api.delete(`/pin/comment/${id}?commentId=${commentId}`),
  update: (id, data) => api.put(`/pin/${id}`, data),
  delete: (id) => api.delete(`/pin/${id}`),
};

// Default export
export default api;
