import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore.js";
const CartItem = (props) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <div className="h-25 w-25 md:h-28 md:w-28 rounded overflow-hidden bg-gray-700">
            <img
              className="h-full w-full object-cover"
              src={props.item.image}
              alt={props.item.name}
            />
          </div>
        </div>
        {/* Product details */}
        <label className="sr-only">Choose quantity:</label>
        <div className="flex items-center gap-4 md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            {/* Remove item button */}
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500"
              onClick={() =>
                updateQuantity(props.item._id, props.item.quantity - 1)
              }
            >
              <Minus className="text-gray-300" />
            </button>
            <p>{props.item.quantity}</p>
            {/* Add item button */}
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                             border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onClick={() =>
                updateQuantity(props.item._id, props.item.quantity + 1)
              }
            >
              <Plus className="text-gray-300" />
            </button>
          </div>

          <div className="text-end w-20 md:w-24">
            <p className="text-base font-bold text-emerald-400">
              ${props.item.price}
            </p>
          </div>
        </div>
        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {props.item.name}
          </p>
          <p className="text-sm text-gray-400">{props.item.description}</p>
        </div>
        {/* Trash button at far right */}
        <div className="md:order-4 md:ml-auto">
          <button
            aria-label="Remove from cart"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-600 bg-gray-700 text-red-400 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => removeFromCart(props.item._id)}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
