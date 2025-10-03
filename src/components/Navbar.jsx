import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "Favorites", path: "/favorites" },
  ];

  return (
    <header className="bg-[#F8AFA6] flex justify-between items-center px-6 py-4 shadow-md relative">
      {/* Logo */}
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#F8AFA6] text-lg">
          CE
        </div>
        <span className="ml-2 font-bold text-gray-800 hidden sm:block">ChefEsther</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 font-semibold items-center">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`${
              isActiveLink(link.path)
                ? "underline text-gray-900"
                : "text-gray-800 hover:underline"
            } transition-all`}
          >
            {link.name}
          </Link>
        ))}
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent w-48 text-gray-800 placeholder-gray-600"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
        </form>

        {/* Favorites Icon */}
        <Link
          to="/favorites"
          className={`p-2 rounded-full ${
            isActiveLink("/favorites") 
              ? "bg-white text-[#F8AFA6]" 
              : "text-gray-800 hover:bg-white hover:text-[#F8AFA6]"
          } transition-colors`}
        >
          <Heart className="w-5 h-5" />
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-white hover:text-[#F8AFA6] transition-colors"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#F8AFA6] border-t border-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  isActiveLink(link.path)
                    ? "underline text-gray-900 font-bold"
                    : "text-gray-800 hover:underline"
                } py-2 transition-all text-center`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-gray-800 placeholder-gray-600"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
            </form>

            {/* Mobile Favorites */}
            <Link
              to="/favorites"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-center gap-2 py-2 ${
                isActiveLink("/favorites")
                  ? "bg-white text-[#F8AFA6]"
                  : "text-gray-800 hover:bg-white hover:text-[#F8AFA6]"
              } rounded-full transition-colors`}
            >
              <Heart className="w-5 h-5" />
              <span>Favorites</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}