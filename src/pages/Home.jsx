import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [cuisines, setCuisines] = useState([]);
  const [, setAllRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);
  const navigate = useNavigate();

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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}