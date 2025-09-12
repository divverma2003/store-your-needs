import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-emerald-800 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-emerald-400 font-semibold">
            © {currentYear} Store Your Needs by &lt;div&gt;ya
          </p>
          <p className="text-gray-400 text-sm">work in prog-mess</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
