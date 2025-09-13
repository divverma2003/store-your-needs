import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios.js";

export const useAnalyticsStore = create((set, get) => ({
  // initial states
  loading: false,
  dailySalesData: [],
  analyticsData: {
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  },

  fetchAnalyticsData: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/analytics");
      set({
        analyticsData: res.data.data?.analyticsData || {
          users: 0,
          products: 0,
          totalSales: 0,
          totalRevenue: 0,
        },
        dailySalesData: res.data.data?.dailySalesData || [],
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch analytics data.";
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
}));
