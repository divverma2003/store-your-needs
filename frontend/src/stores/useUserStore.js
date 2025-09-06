import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  // initial states
  user: null,
  loading: false,
  isCheckingAuth: true, // to check if we are checking for auth status

  // actions
  register: async ({ name, email, password, confirmPassword }) => {
    // send data to backend endpoint
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });

      return toast.error("Passwords do not match.");
    }
    try {
      const res = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      // Backend returns shape: { message, data: { _id, name, email, role, isVerified, ... } }
      set({ user: res.data?.data, loading: false });
      toast.success("Account created successfully!");
      set({ loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while registering, try again later.";

      toast.error(errorMessage);
      set({ loading: false });
    }
  },
  login: async ({ email, password }) => {
    set({ loading: true });
    // send login request to the backend
    try {
      const res = await axios.post("/auth/login", { email, password });
      // Normalize to the user payload (res.data.data)
      set({ user: res.data?.data });
      // console.log(res.data);
      toast.success("Logged in successfully!");
      set({ loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while logging in, try again later.";

      toast.error(errorMessage);
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/auth/logout");
      set({ user: null, loading: false });
      toast.success("Logged out successfully!");
      // window.location.href = "/";
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while logging out.";
      toast.error(errorMessage);
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get("/auth/profile"); // get user info
      console.log("Auth check successful, user:", res.data?.data);
      set({ user: res.data?.data, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isCheckingAuth: false });
      // Don't show error toast for 401 (unauthorized) - it's normal when logged out
      if (error.response?.status === 401) {
        return;
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong.";

      toast.error(errorMessage);
    }
  },
  refreshToken: async () => {},
  verifyEmail: async (token) => {},
}));

// TODO: Implement the axios interceptor to automatically refresh tokens (so user doesn't have to login again when access token expires -- i.e, every 15 minutes).
