import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios.js";

export const useProductStore = create((set, get) => ({
  // initial states
  loading: false,
  products: [],

  // setters
  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data?.data],
        loading: false,
      }));
      toast.success("Product created successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while creating product, try again later.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },
}));
