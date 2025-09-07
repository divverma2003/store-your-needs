import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Upload,
  Loader,
  Pen,
  CircleDollarSign,
} from "lucide-react";

// components
import FormInput from "./FormInput.jsx";

const categories = [
  "shirt",
  "pant",
  "shoe",
  "watch",
  "jacket",
  "hat",
  "glasses",
  "formal-wear",
];

const CreateProductForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
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
      <form onSubmit={handleSubmit} className="space-y-4">
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
          value={newProduct.price}
          onChange={(value) => setNewProduct({ ...newProduct, price: value })}
        />
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
