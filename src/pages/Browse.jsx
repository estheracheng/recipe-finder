import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Star, Filter, Heart, Search, Users, Flame } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [cuisines, setCuisines] = useState([]);
  // const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useRecipe();

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes);
        
        // Get unique cuisines
        const uniqueCuisines = [...new Set(data.recipes.map(recipe => recipe.cuisine))];
        setCuisines(["All", ...uniqueCuisines.sort()]);
        setLoading(false);
      });
  }, []);

  // Filter recipes based on search, cuisine, and difficulty
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCuisine && matchesDifficulty;
  });

  const handleFavoriteClick = (recipe, e) => {
    e.stopPropagation();
    toggleFavorite({
      id: recipe.id,
      title: recipe.name,
      summary: `A delicious ${recipe.cuisine} recipe with ${recipe.ingredients.length} ingredients`,
      image: recipe.image,
      cookingTime: `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins`,
      difficulty: recipe.difficulty
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCuisine("All");
    setSelectedDifficulty("All");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8AFA6] animate-pulse mx-auto mb-4 flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Browse Recipes</h1>
          <p className="text-gray-700 text-lg">Discover your next favorite meal from our collection</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes, ingredients, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent shadow-sm bg-white"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            {/* Cuisine Filter */}
            <div className="relative">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === "All" ? "All Cuisines" : cuisine}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCuisine !== "All" || selectedDifficulty !== "All") && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="font-medium">{filteredRecipes.length}</span> recipe{filteredRecipes.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Recipe Image with Favorite Button */}
              <div className="relative overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => handleFavoriteClick(recipe, e)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isFavorite(recipe.id) 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                    }`}
                  >
                    <Heart 
                      className="w-4 h-4" 
                      fill={isFavorite(recipe.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    recipe.difficulty === "Easy" ? "bg-green-500/90 text-white" :
                    recipe.difficulty === "Medium" ? "bg-yellow-500/90 text-white" :
                    "bg-red-500/90 text-white"
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
              
              {/* Recipe Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#F8AFA6] transition-colors">
                  {recipe.name}
                </h3>
                
                {/* Cuisine Tag */}
                <span className="inline-block px-3 py-1 bg-[#F8AFA6]/20 text-gray-700 rounded-full text-sm mb-3 font-medium">
                  {recipe.cuisine}
                </span>

                {/* Recipe Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                    <span className="font-medium">{recipe.rating}</span>
                  </div>
                </div>

                {/* Calories */}
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{recipe.caloriesPerServing} cal/serving</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{recipe.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No recipes found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCuisine !== "All" || selectedDifficulty !== "All" 
                ? "Try adjusting your search criteria or filters to find more recipes."
                : "No recipes available at the moment. Please check back later."
              }
            </p>
            {(searchTerm || selectedCuisine !== "All" || selectedDifficulty !== "All") && (
              <button
                onClick={clearFilters}
                className="bg-[#F8AFA6] text-gray-800 px-8 py-3 rounded-full hover:bg-[#f5978d] transition-colors font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}