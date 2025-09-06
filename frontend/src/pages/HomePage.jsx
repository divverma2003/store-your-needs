import React from "react";

// Components
import CategoryItem from "../components/CategoryItem.jsx";
const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
  { href: "/t-shirts", name: "T-Shirts", imageUrl: "/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.jpg" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
  { href: "/pantsuits", name: "Pantsuits", imageUrl: "/pantsuits.jpg" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
  { href: "/hats", name: "Hats", imageUrl: "/hats.jpg" },
  { href: "/watches", name: "Watches", imageUrl: "/watches.jpg" },
];
const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover our eco-friendly, timeless apparel and accessories!
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
