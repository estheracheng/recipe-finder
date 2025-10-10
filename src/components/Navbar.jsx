import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Menu, X, ShoppingCart, ChefHat } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";
import { useShoppingList } from "../context/ShoppingListContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useRecipe();
  const { shoppingList } = useShoppingList();

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
    { name: "Shopping List", path: "/shopping-list" },
  ];

  const pendingItems = shoppingList.filter(item => !item.checked).length;

  return (
    <header className="bg-[#F8AFA6] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <ChefHat className="w-6 h-6 text-[#F8AFA6]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-xl leading-tight">ChefEsther</span>
              <span className="text-gray-700 text-sm">Recipe Collection</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActiveLink(link.path)
                    ? "bg-white text-[#F8AFA6] shadow-md"
                    : "text-gray-800 hover:bg-white/50 hover:text-gray-900"
                }`}
              >
                {link.name}
                {link.path === "/favorites" && favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
                {link.path === "/shopping-list" && pendingItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pendingItems}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Search and Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent w-64 text-gray-800 placeholder-gray-600 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
            </form>

            {/* Action Icons */}
            <div className="flex items-center space-x-2">
              <Link
                to="/favorites"
                className={`relative p-3 rounded-full transition-colors ${
                  isActiveLink("/favorites") 
                    ? "bg-white text-red-500 shadow-md" 
                    : "text-gray-800 hover:bg-white hover:text-red-500"
                }`}
              >
                <Heart 
                  className="w-5 h-5" 
                  fill={isActiveLink("/favorites") ? "currentColor" : "none"}
                />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/shopping-list"
                className={`relative p-3 rounded-full transition-colors ${
                  isActiveLink("/shopping-list") 
                    ? "bg-white text-green-600 shadow-md" 
                    : "text-gray-800 hover:bg-white hover:text-green-600"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {pendingItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {pendingItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-800 hover:bg-white hover:text-[#F8AFA6] transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/30 pt-4 pb-6">
            <div className="flex flex-col space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                    isActiveLink(link.path)
                      ? "bg-white text-[#F8AFA6] shadow-md"
                      : "text-gray-800 hover:bg-white/50"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.path === "/favorites" && favorites.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                      {favorites.length}
                    </span>
                  )}
                  {link.path === "/shopping-list" && pendingItems > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center">
                      {pendingItems}
                    </span>
                  )}
                </Link>
              ))}

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-gray-800 placeholder-gray-600"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
                </div>
              </form>

              {/* Mobile Quick Stats */}
              <div className="px-4 pt-2">
                <div className="bg-white/30 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{favorites.length}</div>
                      <div className="text-gray-700">Favorites</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{pendingItems}</div>
                      <div className="text-gray-700">Shopping Items</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}