import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res
      .status(200)
      .json({ message: "Coupon retrieved successfully", data: coupon || null });
  } catch (error) {
    console.log("Error in getCoupon couponController:", error.message);
    return res.status(500).json({
      message: error.message || `Internal server error`,
      error: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    // if the code matches + the coupon has the same user id linked as the current user and is active, it is valid
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    // if a coupon is not fetched, it is not active or valid
    if (!coupon) {
      return res
        .status(404)
        .json({ message: "Invalid or inactive coupon code." });
    }
    if (coupon.expirationDate < Date.now()) {
      coupon.isActive = false; // deactivate the coupon
      await coupon.save();

      return res.status(400).json({ message: "This coupon has expired." });
    }

    return res.status(200).json({
      message: "Coupon is valid.",
      data: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      },
    });
  } catch (error) {
    console.log("Error in validateCoupon couponController:", error.message);
    res.status(500).json({
      message: error.message || `Internal server error`,
      error: error.message,
    });
  }
};
