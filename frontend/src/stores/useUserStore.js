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
  verifyEmail: async (token) => {
    set({ loading: true });
    if (!token) {
      toast.error("Verification token is required");
      set({ loading: false });
      return;
    }
    try {
      const res = await axios.get(`/auth/verify-email/${token}`);
      toast.success(res.data?.message || "Email verified successfully!");
      // Log out the user after successful verification
      set({ user: null, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong.";

      toast.error(errorMessage);
      // rethrow error for component to handle
      throw error; // Re-throw so component can handle it
    }
  },
  resendVerification: async () => {
    set({ loading: true });
    try {
      // get the logged in user's email
      /* const email = get().user?.email;
      if (!email) {
        toast.error("User email not found. Please log in again.");
        set({ loading: false });
        return;
      } */
      const res = await axios.post("/auth/resend-verification");

      toast.success("Verification email sent! Please check your inbox.");
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while resending verification email. Please try again later.";

      toast.error(errorMessage);
    }
  },
  refreshToken: async () => {
    if (get().isCheckingAuth) return;

    set({ isCheckingAuth: true });
    try {
      const res = await axios.post("/auth/refresh-token");
      set({ isCheckingAuth: false });
      return res.data;
    } catch (error) {
      set({ isCheckingAuth: false });
      throw error;
    }
  },
}));

// use refresh token endpoint to get new access token
let refreshPromise = null;
axios.interceptors.response.use(
  // If the response is successful, just return it (access token hasn't expired)
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If we get a 401 response (access token expired), try to refresh the token
    // set retry flag to true to avoid infinite loop (while promise is pending)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
