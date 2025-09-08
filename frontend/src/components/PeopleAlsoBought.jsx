import { useEffect } from "react";

// Stores
import { useProductStore } from "../stores/useProductStore.js";
// Components
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const { recommendations, getRecommendations, loading } = useProductStore();

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
