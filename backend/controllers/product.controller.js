import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res
      .status(200)
      .json({ message: "All products fetched successfully", data: products });
  } catch (error) {
    console.log("Error in getAllProducts productController:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json({
        message: "Featured products fetched successfully.",
        data: JSON.parse(featuredProducts),
      });
    }

    // if not in redis, fetch from mongodb
    // lean returns a plain JS object (instead of a mongodb document, improving performance)
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found." });
    }

    // store in redis for faster access next time
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(
      "Error in getFeaturedProducts productController:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, isFeatured } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      isFeatured: isFeatured || false,
    });

    return res.status(201).json({
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.log("Error in createProduct productController:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // get the image id of the image
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from cloudinary.");
      } catch (error) {
        console.log("Error deleting image from cloudinary:", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log("Error in deleteProduct productController:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate(
      {
        // query 3 random products
        $sample: { size: 3 },
      },
      {
        // Project the necessary fields
        $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 },
      }
    );
    return res.status(200).json({
      message: "Recommended products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.log(
      "Error in getRecommendedProducts productController:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    return res.status(200).json({
      message: "Products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.log(
      "Error in getProductsByCategory productController:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    // update cache/redis
    await updateFeaturedProductsCache();

    return res.status(200).json({
      message: "Product featured status updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(
      "Error in toggleFeaturedProduct productController:",
      error.message
    );
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
