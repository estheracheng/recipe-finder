import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Star, Filter, Heart, Search, Users, Flame, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [cuisines, setCuisines] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
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

  // Sort recipes by different criteria
  const [sortBy, setSortBy] = useState("name");
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "time":
        return (a.prepTimeMinutes + a.cookTimeMinutes) - (b.prepTimeMinutes + b.cookTimeMinutes);
      case "difficulty":
        { const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]; }
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8AFA6] animate-pulse mx-auto mb-4 flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 font-medium">Loading delicious recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#F8AFA6] py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Browse Recipes</h1>
            <p className="text-gray-700 text-lg">Discover your next favorite meal from our collection</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Main Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes, ingredients, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent shadow-sm bg-white"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="time">Sort by Time</option>
                  <option value="difficulty">Sort by Difficulty</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === "grid" ? "bg-[#F8AFA6] text-gray-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === "list" ? "bg-[#F8AFA6] text-gray-800" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm transition-colors ${
                  showFilters ? "bg-[#F8AFA6] text-gray-800" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-4">
                  {/* Cuisine Filter */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
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
                    <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 mt-2" />
                  </div>

                  {/* Difficulty Filter */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
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
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {/* Clear Filters */}
                  {(searchTerm || selectedCuisine !== "All" || selectedDifficulty !== "All") && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                  
                  {/* Results Count */}
                  <div className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                    <span className="font-medium">{filteredRecipes.length}</span> recipe{filteredRecipes.length !== 1 ? 's' : ''} found
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recipes Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedRecipes.map(recipe => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onFavoriteClick={handleFavoriteClick}
                  onNavigate={() => navigate(`/recipe/${recipe.id}`)}
                  isFavorite={isFavorite(recipe.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedRecipes.map(recipe => (
                <RecipeListItem 
                  key={recipe.id} 
                  recipe={recipe} 
                  onFavoriteClick={handleFavoriteClick}
                  onNavigate={() => navigate(`/recipe/${recipe.id}`)}
                  isFavorite={isFavorite(recipe.id)}
                />
              ))}
            </div>
          )}

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
      </main>

      <Footer />
    </div>
  );
}

// Recipe Card Component for Grid View
const RecipeCard = ({ recipe, onFavoriteClick, onNavigate, isFavorite }) => (
  <div
    onClick={onNavigate}
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
          onClick={(e) => onFavoriteClick(recipe, e)}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart 
            className="w-4 h-4" 
            fill={isFavorite ? "currentColor" : "none"}
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
);

// Recipe List Item Component for List View
const RecipeListItem = ({ recipe, onFavoriteClick, onNavigate, isFavorite }) => (
  <div
    onClick={onNavigate}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row">
      {/* Recipe Image */}
      <div className="relative sm:w-48 sm:h-48 w-full h-40 flex-shrink-0">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => onFavoriteClick(recipe, e)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart 
              className="w-4 h-4" 
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#F8AFA6] transition-colors">
                {recipe.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                recipe.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                recipe.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {recipe.difficulty}
              </span>
              <span className="px-3 py-1 bg-[#F8AFA6]/20 text-gray-700 rounded-full text-sm font-medium">
                {recipe.cuisine}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              A delicious {recipe.cuisine} recipe with {recipe.ingredients.length} ingredients
            </p>

            {/* Recipe Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                <span className="font-medium">{recipe.rating} rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{recipe.caloriesPerServing} cal/serving</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 5).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{recipe.tags.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);