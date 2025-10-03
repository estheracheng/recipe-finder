import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8AFA6] text-center py-6 text-gray-800">
      {/* Simple Links */}
      <div className="flex justify-center gap-6 mb-4">
        <Link to="/" className="hover:underline text-sm">Home</Link>
        <Link to="/browse" className="hover:underline text-sm">Browse</Link>
        <Link to="/favorites" className="hover:underline text-sm">Favorites</Link>
      </div>
      
      {/* Copyright with love */}
      <p className="text-sm flex items-center justify-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500" /> by 
        <span className="font-semibold text-green-700 ml-1">ChefEsther</span>
      </p>
      <p className="text-xs text-gray-700 mt-1">
        <span className="text-green-600 font-bold">©</span> {currentYear} All Rights Reserved
      </p>
    </footer>
  );
}