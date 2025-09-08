import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore.js";
import { useRef } from "react";
const CartItem = (props) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  const dialogRef = useRef(null);

  const openConfirm = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleYes = () => {
    removeFromCart(props.item._id);
    dialogRef.current.close();
  };

  const handleNo = () => {
    dialogRef.current.close();
  };

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
                props.item.quantity > 1
                  ? updateQuantity(props.item._id, props.item.quantity - 1)
                  : openConfirm()
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
              ${props.item.price.toFixed(2)}
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
            onClick={openConfirm}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Confirm dialog for this item */}
      <dialog
        ref={dialogRef}
        className="p-0 rounded-xl shadow-2xl bg-transparent fixed inset-0 m-auto w-fit h-fit"
      >
        <div className="w-[90vw] max-w-sm md:max-w-md mx-auto bg-gray-800 border border-gray-700 text-gray-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-700">
            <h3 className="text-sm font-semibold text-gray-200">Remove item</h3>
          </div>
          <div className="px-5 py-4 text-sm text-gray-300">
            Are you sure you want to remove
            <span className="font-medium text-white"> {props.item.name} </span>
            from your cart?
          </div>
          <div className="px-5 py-4 flex items-center justify-end gap-2 bg-gray-900/60">
            <button
              onClick={handleNo}
              className="inline-flex items-center rounded-md border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              onClick={handleYes}
              className="inline-flex items-center rounded-md bg-red-900 px-3 py-1.5 text-sm text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CartItem;
