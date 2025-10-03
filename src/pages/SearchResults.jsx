import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Clock, Star } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      fetch(`https://dummyjson.com/recipes/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setRecipes(data.recipes || []);
          setLoading(false);
        });
    } else {
      setRecipes([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#F8AFA6] animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F8AFA6] py-8 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
        <p className="text-gray-700">for "{query}"</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {recipe.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-[#F8AFA6] text-gray-800 rounded-full text-sm mb-3">
                  {recipe.cuisine}
                </span>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{recipe.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {recipes.length === 0 && query && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-gray-600 text-lg">No recipes found for "{query}"</p>
            <p className="text-gray-500">Try different keywords</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-gray-600">Enter a search term to find recipes</p>
          </div>
        )}
      </div>
    </div>
  );
}