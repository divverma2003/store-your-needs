import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;
    // find products in the user's cart
    const products = await Product.find({ _id: { $in: user.cartItems } });

    // add quantity for each product that's also in the user's cart
    // this will allow us to receive additional info about each product that's in the user's cart
    // other than just the product id + quantity
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      // return { ...product.toJSON(), quantity: item ? item.quantity : 0 };
      return { ...product.toJSON(), quantity: item.quantity };
    });

    return res.status(200).json({
      message: "Cart retrieved successfully.",
      data: cartItems,
    });
  } catch (error) {
    console.log("Error in getCartProducts cartController:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if item exists in the current user's cart
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const product = await Product.findById(productId);
      if (product) {
        user.cartItems.push({ id: product.id, quantity: 1 });
      } else {
        return res.status(404).json({
          message: "Product not found. Unable to add to cart.",
        });
      }
    }
    await user.save();
    return res.status(200).json({
      message: "Product added to cart successfully.",
      data: user.cartItems,
    });
  } catch (error) {
    console.log("Error in addToCart cartController:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// To remove all items from the cart and clear the frontend
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = []; // empty the cart if no productId is provided (cart is already empty)
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    return res.status(200).json({
      message: "Cart updated successfully.",
      data: user.cartItems,
    });
  } catch (error) {
    console.log("Error in removeAllFromCart cartController:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // product id
    const { quantity } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        // item quantity is 0, remove from cart
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json({
          message: "Item removed from cart.",
          data: user.cartItems,
        });
      } else {
        existingItem.quantity = quantity;
        await user.save();
        return res.status(200).json({
          message: "Item quantity updated.",
          data: user.cartItems,
        });
      }
    } else {
      res.status(404).json({
        message: "Item not found in cart.",
      });
    }
  } catch (error) {
    console.log("Error in updateQuantity cartController:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
