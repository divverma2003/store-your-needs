import { create } from "zustand";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

import axios from "../lib/axios.js";

let stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// if the key is undefined, load manually
stripePublishableKey =
  stripePublishableKey ||
  "pk_test_51S2dYRJYynBvPZpTvh50Fm0pkvWAfzWtZVupU24ggLaa9haFirAAGu43CgohQ9Tbol71YXAVNrt9R8S8XTJ6OcZE00cqPAXo9p";
const stripePromise = loadStripe(stripePublishableKey);
console.log("Stripe Publishable Key:", stripePublishableKey);

export const usePaymentStore = create((set, get) => ({
  isProcessing: false,
  createCheckoutSession: async (cartItems, coupon) => {
    try {
      const stripe = await stripePromise;

      const data = {
        products: cartItems,
        couponCode: coupon?.code || null,
      };
      const res = await axios.post("/payments/create-checkout-session", {
        products: cartItems,
        couponCode: coupon?.code || null,
      });

      const session = res.data;
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.log("Error:", result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to initiate payment."
      );
    }
  },
  checkoutSuccess: async (sessionId) => {
    set({ isProcessing: true });
    try {
      const res = await axios.post("/payments/checkout-success", { sessionId });
      toast.success("Payment successful!");
      set({ isProcessing: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process payment.";
      toast.error(errorMessage);
      set({ isProcessing: false });
    }
  },
}));
