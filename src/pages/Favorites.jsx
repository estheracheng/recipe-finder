import { useNavigate } from "react-router-dom";
import { useRecipe } from '../context/RecipeContext';
import { Clock, Star, Heart, Trash2, ArrowRight } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useRecipe();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">My Favorites</h1>
          <p className="text-gray-700 text-lg">Your saved recipes ({favorites.length})</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => handleCardClick(recipe.id)}
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
                      onClick={(e) => handleRemoveFavorite(recipe.id, e)}
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

                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#F8AFA6] transition-colors">
                    {recipe.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {recipe.summary}
                  </p>

                  <button 
                    onClick={(e) => handleViewRecipe(recipe.id, e)}
                    className="w-full bg-[#F8AFA6] hover:bg-[#f5978d] text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    View Recipe
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-gray-700" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No favorites yet</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start saving your favorite recipes to see them here!
            </p>
            <button 
              onClick={() => navigate('/browse')}
              className="bg-[#F8AFA6] text-gray-800 px-8 py-4 rounded-full hover:bg-[#f5978d] transition-colors font-semibold text-lg flex items-center gap-2 mx-auto"
            >
              Browse Recipes
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Quick Stats when there are favorites */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{favorites.length}</div>
                <div className="text-sm text-gray-600">Saved Recipes</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {favorites.filter(recipe => recipe.difficulty === 'Easy').length}
                </div>
                <div className="text-sm text-gray-600">Easy Recipes</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {new Set(favorites.map(recipe => recipe.cookingTime)).size}
                </div>
                <div className="text-sm text-gray-600">Time Variations</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}