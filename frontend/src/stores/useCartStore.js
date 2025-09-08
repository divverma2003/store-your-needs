import { create } from "zustand";
import { toast } from "react-hot-toast";

import axios from "../lib/axios.js";
import { updateQuantity } from "../../../backend/controllers/cart.controller.js";

export const useCartStore = create((set, get) => ({
  // initial states
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data?.data || [] });
      console.log("Cart items fetched:", res.data?.data || []);
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch cart items.";
      toast.error(errorMessage);
    }
  },
  addToCart: async (product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });
      toast.success(`"${product.name}" added to cart!`);

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add item to cart.";
      toast.error(errorMessage);
    }
  },

  removeFromCart: async (productId) => {
    try {
      const res = await axios.delete(`/cart/`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while removing item from cart.";
      toast.error(errorMessage);
    }
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error while updating item quantity.";
      toast.error(errorMessage);
    }
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
