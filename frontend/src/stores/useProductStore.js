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
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data?.data || [], loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch products.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      set({ products: res.data?.data || [], loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch products by category.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },
  fetchFeaturedProducts: async () => {},
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
      toast.success("Product deleted successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while deleting product.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      console.log("Toggling featured for product ID:", productId);
      const res = await axios.patch(`/products/${productId}`);
      // update the product in the products array
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          productId === product._id
            ? {
                ...product,
                isFeatured: res.data?.data.isFeatured,
              }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while toggling featured status.";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },
}));
