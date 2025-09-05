import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  // initial states
  user: null,
  loading: false,
  isCheckingAuth: true, // to check if we are checking for auth status
  isRegistering: false,
  isLoggingIn: false,
  isVerifyingEmail: false,

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
      set({ user: res.data.user, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      console.log("Registration error:", error); // Debug log

      // More specific error handling
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while registering, try again later.";

      toast.error(errorMessage);
    }
  },
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  refreshToken: async () => {},
  verifyEmail: async (token) => {},
}));
