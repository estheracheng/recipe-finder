import { useEffect, useState, useRef } from "react";
import CategoryCard from "../components/CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [cuisines, setCuisines] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then(res => res.json())
      .then(data => {
        const cuisineMap = {};
        data.recipes.forEach(recipe => {
          if (!cuisineMap[recipe.cuisine]) {
            cuisineMap[recipe.cuisine] = recipe.image;
          }
        });
        setCuisines(Object.entries(cuisineMap).map(([name, image]) => ({ name, image })));
      });
  }, []);

  // Scroll handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-3">
        Discover Amazing Recipes
      </h1>
      <p className="text-gray-700 text-center mb-6">
        Find your next favorite meal from thousands of delicious recipes
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-xl relative mb-10">
        <input
          type="text"
          placeholder="Search your desired recipe..."
          className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Cuisine Section with Scroll Buttons */}
      <div className="relative w-full max-w-5xl">
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
          {cuisines.map((cuisine, i) => (
            <CategoryCard key={i} name={cuisine.name} image={cuisine.image} />
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#F8AFA6] p-2 rounded-full shadow-md hover:bg-[#f5978d] z-10"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </main>
  );
}
