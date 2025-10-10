import { useNavigate } from "react-router-dom";
import { useRecipe } from '../context/RecipeContext';
import { Clock, Heart, Trash2, ArrowRight, Grid3X3, List, Filter, ChefHat, Users, Clock4 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useRecipe();
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("added"); // "added", "time", "difficulty"

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRemoveFavorite = (recipeId, e) => {
    e.stopPropagation();
    removeFromFavorites(recipeId);
  };

  const handleViewRecipe = (recipeId, e) => {
    e.stopPropagation();
    navigate(`/recipe/${recipeId}`);
  };

  const handleCardClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  // Sort favorites
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case "time":
        { const getTimeMinutes = (timeStr) => parseInt(timeStr.replace(' mins', ''));
        return getTimeMinutes(a.cookingTime) - getTimeMinutes(b.cookingTime); }
      case "difficulty":
        { const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]; }
      default:
        return 0; // Keep in added order
    }
  });

  // Calculate stats
  const stats = {
    total: favorites.length,
    easy: favorites.filter(recipe => recipe.difficulty === 'Easy').length,
    medium: favorites.filter(recipe => recipe.difficulty === 'Medium').length,
    hard: favorites.filter(recipe => recipe.difficulty === 'Hard').length,
    timeVariations: new Set(favorites.map(recipe => recipe.cookingTime)).size,
    avgTime: favorites.reduce((acc, recipe) => {
      const time = parseInt(recipe.cookingTime.replace(' mins', ''));
      return acc + time;
    }, 0) / favorites.length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#F8AFA6] py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-[#F8AFA6]" fill="currentColor" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">My Favorites</h1>
            <p className="text-gray-700 text-lg">
              {favorites.length === 0 
                ? "Your saved recipes will appear here" 
                : `Your collection of ${favorites.length} cherished recipes`
              }
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Controls Section */}
          {favorites.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm"
                  >
                    <option value="added">Sort by Added</option>
                    <option value="time">Sort by Time</option>
                    <option value="difficulty">Sort by Difficulty</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
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
              </div>

              {/* Results Count */}
              <div className="text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="font-medium">{favorites.length}</span> favorite{favorites.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Favorites Grid/List */}
          {favorites.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedFavorites.map((recipe) => (
                  <FavoriteRecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onRemove={handleRemoveFavorite}
                    onView={handleViewRecipe}
                    onClick={handleCardClick}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFavorites.map((recipe) => (
                  <FavoriteRecipeListItem 
                    key={recipe.id} 
                    recipe={recipe} 
                    onRemove={handleRemoveFavorite}
                    onView={handleViewRecipe}
                    onClick={handleCardClick}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))}
              </div>
            )
          ) : (
            <EmptyFavoritesState onBrowseClick={() => navigate('/browse')} />
          )}

          {/* Enhanced Stats Section */}
          {favorites.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Your Favorites Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard 
                  icon={<Heart className="w-6 h-6" />}
                  value={stats.total}
                  label="Total Recipes"
                  color="text-red-500"
                />
                <StatCard 
                  icon={<ChefHat className="w-6 h-6" />}
                  value={stats.easy}
                  label="Easy Recipes"
                  color="text-green-500"
                />
                <StatCard 
                  icon={<Users className="w-6 h-6" />}
                  value={stats.medium}
                  label="Medium Recipes"
                  color="text-yellow-500"
                />
                <StatCard 
                  icon={<Clock4 className="w-6 h-6" />}
                  value={stats.hard}
                  label="Hard Recipes"
                  color="text-red-500"
                />
                <StatCard 
                  icon={<Clock className="w-6 h-6" />}
                  value={stats.timeVariations}
                  label="Time Variations"
                  color="text-blue-500"
                />
                <StatCard 
                  icon={<Filter className="w-6 h-6" />}
                  value={Math.round(stats.avgTime)}
                  label="Avg Time (mins)"
                  color="text-purple-500"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Favorite Recipe Card Component for Grid View
const FavoriteRecipeCard = ({ recipe, onRemove, onView, onClick, getDifficultyColor }) => (
  <div
    onClick={() => onClick(recipe.id)}
    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
  >
    {/* Recipe Image */}
    <div className="relative overflow-hidden">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getDifficultyColor(recipe.difficulty)}`}>
          {recipe.difficulty}
        </span>
        <button
          onClick={(e) => onRemove(recipe.id, e)}
          className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Recipe Content */}
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {recipe.cookingTime}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F8AFA6] transition-colors line-clamp-2">
        {recipe.title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {recipe.summary}
      </p>

      <button 
        onClick={(e) => onView(recipe.id, e)}
        className="w-full bg-[#F8AFA6] hover:bg-[#f5978d] text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
      >
        View Recipe
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

// Favorite Recipe List Item Component for List View
const FavoriteRecipeListItem = ({ recipe, onRemove, onView, onClick, getDifficultyColor }) => (
  <div
    onClick={() => onClick(recipe.id)}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row">
      {/* Recipe Image */}
      <div className="relative sm:w-48 sm:h-48 w-full h-40 flex-shrink-0">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => onRemove(recipe.id, e)}
            className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
            title="Remove from favorites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="flex-1 p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#F8AFA6] transition-colors">
                {recipe.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.cookingTime}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {recipe.summary}
            </p>

            <button 
              onClick={(e) => onView(recipe.id, e)}
              className="bg-[#F8AFA6] hover:bg-[#f5978d] text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 group/btn"
            >
              View Recipe
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyFavoritesState = ({ onBrowseClick }) => (
  <div className="text-center py-16">
    <div className="w-32 h-32 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
      <Heart className="w-16 h-16 text-white" />
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-3">No favorites yet</h2>
    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
      Start building your personal recipe collection by saving your favorite dishes!
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        onClick={onBrowseClick}
        className="bg-[#F8AFA6] text-gray-800 px-8 py-4 rounded-full hover:bg-[#f5978d] transition-colors font-semibold text-lg flex items-center gap-2"
      >
        Browse Recipes
        <ArrowRight className="w-5 h-5" />
      </button>
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-white text-gray-700 px-8 py-4 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors font-semibold text-lg flex items-center gap-2"
      >
        Back to Top
        <ArrowRight className="w-5 h-5 rotate-90" />
      </button>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
    <div className={`${color} mb-2 flex justify-center`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);