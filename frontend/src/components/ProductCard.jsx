import React from "react";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to your cart.", {
        id: "login-to-add",
      });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex h-full w-full max-w-sm relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg bg-gray-800 transition-transform hover:scale-105">
      <div className="relative mx-4 mt-4 flex h-64 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full h-full"
          src={product.image}
          alt={`${product.name} image`}
        />
      </div>

      <div className="flex flex-col flex-grow mt-6 px-6 pb-6">
        <h5 className="text-xl font-semibold tracking-tight text-white mb-3">
          {product.name}
        </h5>
        <div className="flex items-center justify-between mb-6 flex-grow">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product.price.toFixed(2)}
            </span>
          </p>
        </div>
        <button
          className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-4 text-center text-base font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-colors duration-200"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={24} className="mr-3" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
