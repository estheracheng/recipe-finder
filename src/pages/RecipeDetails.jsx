import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Star, Users, ArrowLeft, Heart } from "lucide-react";
import { useRecipe } from "../context/RecipeContext";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useRecipe();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(false);

  useEffect(() => {
    fetch(`https://dummyjson.com/recipes/${recipeId}`)
      .then(res => res.json())
      .then(data => {
        setRecipe(data);
        setIsRecipeFavorite(isFavorite(data.id));
        setLoading(false);
      });
  }, [recipeId, isFavorite]);

  const handleToggleFavorite = () => {
    if (recipe) {
      toggleFavorite({
        id: recipe.id,
        title: recipe.name,
        summary: `A delicious ${recipe.cuisine} recipe`,
        image: recipe.image,
        cookingTime: `${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins`,
        difficulty: recipe.difficulty
      });
      setIsRecipeFavorite(!isRecipeFavorite);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#F8AFA6] animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Recipe Not Found</h1>
          <button 
            onClick={() => navigate('/browse')}
            className="bg-[#F8AFA6] text-gray-800 px-6 py-2 rounded-full hover:bg-[#f5978d] transition-colors"
          >
            Browse Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button 
            onClick={() => navigate('/favorites')}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-900"
          >
            <Heart className="w-5 h-5" fill={isRecipeFavorite ? "currentColor" : "none"} />
            My Favorites
          </button>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Recipe Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full lg:w-1/2 h-80 object-cover rounded-2xl"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{recipe.name}</h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="px-4 py-2 bg-[#F8AFA6] text-gray-800 rounded-full">
                {recipe.cuisine}
              </span>
              <span className={`px-4 py-2 rounded-full ${
                recipe.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                recipe.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {recipe.difficulty}
              </span>
            </div>

            {/* Recipe Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">{recipe.rating} ({recipe.reviewCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">🔥 {recipe.caloriesPerServing} cal</span>
              </div>
            </div>

            <button 
              onClick={handleToggleFavorite}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-colors ${
                isRecipeFavorite 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-white border border-[#F8AFA6] text-gray-800 hover:bg-[#F8AFA6]"
              }`}
            >
              <Heart className="w-5 h-5" fill={isRecipeFavorite ? "currentColor" : "none"} />
              {isRecipeFavorite ? "Saved to Favorites" : "Save Recipe"}
            </button>
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700">
                <div className="w-2 h-2 bg-[#F8AFA6] rounded-full"></div>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-[#F8AFA6] text-gray-800 rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <p className="text-gray-700 pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}