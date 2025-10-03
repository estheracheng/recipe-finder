import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Star, Filter } from "lucide-react";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [cuisines, setCuisines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes);
        
        // Get unique cuisines
        const uniqueCuisines = [...new Set(data.recipes.map(recipe => recipe.cuisine))];
        setCuisines(["All", ...uniqueCuisines]);
        setLoading(false);
      });
  }, []);

  // Filter recipes based on search and cuisine
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#F8AFA6] animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-8 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Recipes</h1>
        <p className="text-gray-700">Discover your next favorite meal</p>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search recipes or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent"
            />
          </div>

          {/* Cuisine Filter */}
          <div className="relative">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
            {selectedCuisine !== "All" && ` in ${selectedCuisine}`}
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Recipe Image */}
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              
              {/* Recipe Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {recipe.name}
                </h3>
                
                {/* Cuisine Tag */}
                <span className="inline-block px-3 py-1 bg-[#F8AFA6] text-gray-800 rounded-full text-sm mb-3">
                  {recipe.cuisine}
                </span>

                {/* Recipe Details */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{recipe.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    recipe.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                    recipe.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🍳</span>
            </div>
            <p className="text-gray-600 text-lg">No recipes found</p>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}