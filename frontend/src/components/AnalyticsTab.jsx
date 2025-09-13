import React from "react";
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import { useAnalyticsStore } from "../stores/useAnalyticsStore.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
const AnalyticsTab = () => {
  const { fetchAnalyticsData, loading, analyticsData, dailySalesData } =
    useAnalyticsStore();
  // const hasFetchedRef = useRef(false);
  useEffect(() => {
    fetchAnalyticsData();
    // hasFetchedRef.current = true;
  }, [fetchAnalyticsData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-purple-500 to-indigo-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-yellow-500 to-orange-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-pink-500 to-red-700"
        />
      </div>
    </div>
  );
};

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <div className="flex justify-between items-center">
      <div className="z-10">
        <p className="text-emerald-300 text-sm mb-1 font-semibold">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30">
      <div className="absolute -bottom-4 -right-4 text-emerald-800 opacity-50">
        <Icon className="h-32 w-32" />
      </div>
    </div>
  </motion.div>
);

export default AnalyticsTab;
