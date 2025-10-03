import { useNavigate } from "react-router-dom";
import { Clock, Star, Heart } from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  
  // This would typically come from a context or localStorage
  const favoriteRecipes = []; // Empty for now

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-8 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Favorites</h1>
        <p className="text-gray-700">Your saved recipes</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Favorite recipes would be mapped here */}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start saving your favorite recipes!</p>
            <button 
              onClick={() => navigate('/browse')}
              className="bg-[#F8AFA6] text-gray-800 px-6 py-3 rounded-full hover:bg-[#f5978d] transition-colors"
            >
              Browse Recipes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}