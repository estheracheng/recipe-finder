import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useRecipe } from "../context/RecipeContext";

export default function Home() {
  const [cuisines, setCuisines] = useState([]);
  const [, setAllRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { favorites } = useRecipe();

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then(res => res.json())
      .then(data => {
        setAllRecipes(data.recipes);
        const cuisineMap = {};
        data.recipes.forEach(recipe => {
          if (!cuisineMap[recipe.cuisine]) {
            cuisineMap[recipe.cuisine] = recipe.image;
          }
        });
        setCuisines(
          Object.entries(cuisineMap).map(([name, image]) => ({ name, image }))
        );
      });
  }, []);

  // Filter cuisines based on search
  const filteredCuisines = cuisines.filter(cuisine =>
    cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCuisineClick = (cuisineName) => {
    navigate(`/cuisine/${cuisineName}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleViewFavorites = () => {
    navigate('/favorites');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-3">
          Discover Amazing Recipes
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Find your next favorite meal from thousands of delicious recipes
        </p>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => navigate('/browse')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition-colors"
          >
            Browse All Recipes
          </button>
          <button 
            onClick={handleViewFavorites}
            className="bg-[#F8AFA6] hover:bg-[#f5978d] text-gray-800 px-6 py-3 rounded-full transition-colors flex items-center gap-2"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            My Favorites ({favorites.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl relative mb-10">
          <SearchBar
            type="text"
            placeholder="Search cuisines..."
            onSearch={handleSearch}
          />
        </div>

        {/* Cuisine Section with Scroll Buttons */}
        <div className="relative w-full max-w-5xl">
          {filteredCuisines.length > 0 ? (
            <>
              {/* Left Button */}
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#F8AFA6] p-2 rounded-full shadow-md hover:bg-[#f5978d] z-10"
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>

              {/* Scrollable container */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-10"
              >
                {filteredCuisines.map((cuisine, i) => (
                  <div
                    key={i}
                    onClick={() => handleCuisineClick(cuisine.name)}
                    className="cursor-pointer"
                  >
                    <CategoryCard name={cuisine.name} image={cuisine.image} />
                  </div>
                ))}
              </div>

              {/* Right Button */}
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#F8AFA6] p-2 rounded-full shadow-md hover:bg-[#f5978d] z-10"
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No cuisines found matching your search.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🍳</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Easy to Cook</h3>
            <p className="text-gray-600 text-sm">Step-by-step instructions for every recipe</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-gray-800" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Save Favorites</h3>
            <p className="text-gray-600 text-sm">Keep track of your favorite recipes</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Global Cuisines</h3>
            <p className="text-gray-600 text-sm">Discover recipes from around the world</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}