import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Clock, Star } from "lucide-react";

export default function CuisineRecipes() {
  const { cuisineName } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [timeFilter, setTimeFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`https://dummyjson.com/recipes/tag/${cuisineName}`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data.recipes || []);
        setFilteredRecipes(data.recipes || []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback: filter from all recipes if specific cuisine endpoint doesn't work
        fetch("https://dummyjson.com/recipes")
          .then(res => res.json())
          .then(data => {
            const cuisineRecipes = data.recipes.filter(
              recipe => recipe.cuisine.toLowerCase() === cuisineName.toLowerCase()
            );
            setRecipes(cuisineRecipes);
            setFilteredRecipes(cuisineRecipes);
            setLoading(false);
          });
      });
  }, [cuisineName]);

  // Apply filters
  useEffect(() => {
    let filtered = [...recipes];

    // Time filter
    if (timeFilter !== "all") {
      filtered = filtered.filter(recipe => {
        const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
        if (timeFilter === "quick" && totalTime <= 30) return true;
        if (timeFilter === "medium" && totalTime > 30 && totalTime <= 60) return true;
        if (timeFilter === "long" && totalTime > 60) return true;
        return false;
      });
    }

    // Tag filter
    if (tagFilter) {
      filtered = filtered.filter(recipe =>
        recipe.tags.some(tag =>
          tag.toLowerCase().includes(tagFilter.toLowerCase())
        )
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(recipe =>
        recipe.difficulty.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(recipe => recipe.rating >= ratingFilter);
    }

    setFilteredRecipes(filtered);
  }, [timeFilter, tagFilter, difficultyFilter, ratingFilter, recipes]);

  const clearFilters = () => {
    setTimeFilter("all");
    setTagFilter("");
    setDifficultyFilter("all");
    setRatingFilter(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#F8AFA6] shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {cuisineName} Recipes
            </h1>
            <span className="text-gray-500">
              ({filteredRecipes.length} recipes)
            </span>
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            {(timeFilter !== "all" || tagFilter || difficultyFilter !== "all" || ratingFilter > 0) && (
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-100 rounded-lg">
              {/* Time Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Time
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Any Time</option>
                  <option value="quick">Quick (&lt; 30 min)</option>
                  <option value="medium">Medium (30-60 min)</option>
                  <option value="long">Long (&gt; 60 min)</option>
                </select>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g., vegetarian, spicy"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Any Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found matching your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-green-600 hover:text-green-700"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Recipe Card Component
function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.name}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{totalTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === "Easy" ? "bg-green-100 text-green-800" :
            recipe.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {recipe.difficulty}
          </span>
          <span className="text-gray-500">{recipe.cuisine}</span>
        </div>
      </div>
    </div>
  );
}