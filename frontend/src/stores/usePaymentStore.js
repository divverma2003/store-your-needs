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
  createCheckoutSession: async (cartItems, coupon) => {
    try {
      const stripe = await stripePromise;

      const data = {
        products: cartItems,
        couponCode: coupon?.code || null,
      };
      console.log("Creating checkout session with data:", data);
      const res = await axios.post("/payments/create-checkout-session", {
        products: cartItems,
        couponCode: coupon?.code || null,
      });

      const session = res.data;
      console.log("Checkout session created:", session);
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
}));
