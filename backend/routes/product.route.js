import express from "express";
import {
  protectRoute,
  requireVerifiedEmail,
  adminRoute,
} from "../middleware/auth.middleware.js";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", protectRoute, requireVerifiedEmail, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);

router.post("/", protectRoute, requireVerifiedEmail, adminRoute, createProduct);
router.patch(
  "/:id",
  protectRoute,
  requireVerifiedEmail,
  adminRoute,
  toggleFeaturedProduct
);
router.delete(
  "/:id",
  protectRoute,
  requireVerifiedEmail,
  adminRoute,
  deleteProduct
);

export default router;
