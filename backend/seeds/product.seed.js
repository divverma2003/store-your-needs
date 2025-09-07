import Product from "../models/product.model.js"; // adjust path if needed
import dotenv from "dotenv";

import { connectDB } from "../lib/db.js";

dotenv.config(); // Load environment variables from .env file

const products = [
  // Shirts
  {
    name: "Classic White Shirt",
    description:
      "A crisp cotton white shirt perfect for formal or casual wear.",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "shirt",
    isFeatured: true,
  },
  {
    name: "Casual Denim Shirt",
    description:
      "Blue denim shirt with button-down style for everyday comfort.",
    price: 45.5,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
    category: "shirt",
  },

  // Pants
  {
    name: "Slim Fit Chinos",
    description: "Beige chinos with a slim fit, versatile for work or leisure.",
    price: 55.0,
    image: "https://images.unsplash.com/photo-1602810318383-e1884979af7d",
    category: "pant",
    isFeatured: true,
  },
  {
    name: "Classic Black Trousers",
    description: "Elegant black trousers tailored for formal occasions.",
    price: 60.0,
    image: "https://images.unsplash.com/photo-1585409677983-5d9f1b8a56f1",
    category: "pant",
  },

  // Shoes
  {
    name: "Running Sneakers",
    description: "Lightweight sneakers with breathable mesh for daily runs.",
    price: 75.25,
    image: "https://images.unsplash.com/photo-1600180758895-74c1a2af3a50",
    category: "shoe",
  },
  {
    name: "Leather Dress Shoes",
    description:
      "Premium black leather shoes ideal for business and formal events.",
    price: 120.0,
    image: "https://images.unsplash.com/photo-1528701800489-20be9c1e4e08",
    category: "shoe",
    isFeatured: true,
  },

  // Watches
  {
    name: "Minimalist Analog Watch",
    description: "Simple and elegant watch with leather strap and clean dial.",
    price: 85.0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    category: "watch",
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track steps, workouts, and notifications with this smart wearable.",
    price: 150.0,
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    category: "watch",
    isFeatured: true,
  },

  // Jackets
  {
    name: "Bomber Jacket",
    description: "Trendy bomber jacket with zipper closure and side pockets.",
    price: 95.5,
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543",
    category: "jacket",
  },
  {
    name: "Wool Winter Coat",
    description: "Stay warm with this long wool coat, ideal for cold weather.",
    price: 180.0,
    image: "https://images.unsplash.com/photo-1602810318383-7d0b26c42e6a",
    category: "jacket",
    isFeatured: true,
  },

  // Hats
  {
    name: "Baseball Cap",
    description: "Adjustable cotton baseball cap for casual outings.",
    price: 20.0,
    image: "https://images.unsplash.com/photo-1587049352847-4c1d3e7b3e6b",
    category: "hat",
  },
  {
    name: "Wool Beanie",
    description: "Cozy wool beanie to keep your head warm in winter.",
    price: 18.5,
    image: "https://images.unsplash.com/photo-1611866574658-b5d76e9b5b33",
    category: "hat",
  },

  // Glasses
  {
    name: "Classic Aviator Sunglasses",
    description: "Timeless aviator sunglasses with UV protection.",
    price: 65.0,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    category: "glasses",
    isFeatured: true,
  },
  {
    name: "Blue Light Blocking Glasses",
    description: "Protect your eyes from digital screens with stylish frames.",
    price: 40.0,
    image: "https://images.unsplash.com/photo-1557821552-17105176677c",
    category: "glasses",
  },

  // Formal Wear
  {
    name: "Men’s Two-Piece Suit",
    description: "Modern-fit suit made with premium fabric for all occasions.",
    price: 250.0,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    category: "formal-wear",
    isFeatured: true,
  },
  {
    name: "Evening Gown",
    description: "Elegant floor-length evening gown with a flowing silhouette.",
    price: 300.0,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
    category: "formal-wear",
  },
  {
    name: "Tuxedo Set",
    description: "Classic black tuxedo for weddings and formal gatherings.",
    price: 350.0,
    image: "https://images.unsplash.com/photo-1538601226880-2b17a9ab6d1c",
    category: "formal-wear",
  },
  {
    name: "Cocktail Dress",
    description: "Chic cocktail dress with a modern cut for special evenings.",
    price: 200.0,
    image: "https://images.unsplash.com/photo-1614315198287-856a74d3a2d2",
    category: "formal-wear",
  },
];

const seedProductsInDB = async () => {
  try {
    await connectDB();
    // Insert fresh products
    await Product.insertMany(products);
    console.log("Products seeded successfully.");
  } catch (error) {
    console.error("Error seeding products:", error.message);
  } finally {
    process.exit();
  }
};

seedProductsInDB();
