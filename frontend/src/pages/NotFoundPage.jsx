import React from "react";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 max-w-md">
        {/* Header with Logo */}
        <div className="mb-6">
          <div className="flex flex-col items-center gap-2 group">
            <SearchX className="size-16 text-emerald-400 mb-2" />
            <h1 className="text-6xl font-bold text-emerald-400 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Oops! Where's my page?
            </h2>
          </div>
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <p className="text-lg text-gray-300 mb-2">
            We couldn't find what you were looking for...
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Unless you were looking for this page. In that case,
            <span className="text-emerald-400 font-semibold">
              {" "}
              congrats! 🎉
            </span>
          </p>
          <p className="text-sm text-gray-400">
            The page you're trying to reach has gone on an adventure (or never
            existed in the first place).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-300 ease-in-out font-medium"
          >
            <Home className="size-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition duration-300 ease-in-out font-medium"
          >
            <ArrowLeft className="size-5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
