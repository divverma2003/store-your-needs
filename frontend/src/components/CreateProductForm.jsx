import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Upload,
  Loader,
  Pen,
  CircleDollarSign,
  Check,
} from "lucide-react";

// components
import FormInput from "./FormInput.jsx";

import { useProductStore } from "../stores/useProductStore.js";

const categories = [
  "shirts",
  "pants",
  "shoes",
  "watches",
  "jackets",
  "hats",
  "glasses",
  "formal-wear",
  "bags",
];

const CreateProductForm = () => {
  const { createProduct, loading } = useProductStore();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file); // Convert image to base64 string
    }
  };
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>
      {/* Product creation form */}
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
        <FormInput
          label="Product Name"
          name="name"
          type="text"
          icon={Pen}
          required
          value={newProduct.name}
          onChange={(value) => setNewProduct({ ...newProduct, name: value })}
        />
        <FormInput
          label="Description"
          name="description"
          type="textarea"
          required
          value={newProduct.description}
          onChange={(value) =>
            setNewProduct({ ...newProduct, description: value })
          }
        />
        <FormInput
          label="Price"
          name="price"
          type="number"
          icon={CircleDollarSign}
          required
          step="0.01"
          min="0"
          value={newProduct.price}
          onChange={(value) => setNewProduct({ ...newProduct, price: value })}
        />
        <FormInput
          label="Category"
          name="category"
          type="select"
          required
          options={categories}
          value={newProduct.category}
          onChange={(value) =>
            setNewProduct({ ...newProduct, category: value })
          }
        />

        {/* Image upload */}
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-emerald-400 font-medium flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Image uploaded successfully
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
