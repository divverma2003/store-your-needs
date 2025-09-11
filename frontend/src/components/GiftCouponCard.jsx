import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useCartStore } from "../stores/useCartStore";
import { set } from "mongoose";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, getMyCoupon, validateCoupon, isCouponApplied } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    // Logic to apply the coupon code
    validateCoupon(userInputCode);
    // Reset input field after applying
    setUserInputCode("");
  };

  const handleRemoveCoupon = () => {
    // Logic to remove the applied coupon
    removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Have a coupon code?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        {/* Apply Button */}
        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleApplyCoupon}
        >
          Apply Code
        </motion.button>
      </div>
      {/* Display applied coupon details and remove option */}
      {coupon && isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Coupon Applied:</h3>

          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} : {coupon.discount}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {/* Display available coupons message */}
      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} : {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;
