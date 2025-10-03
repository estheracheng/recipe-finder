import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

export default function Browse() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes); // default
      });
  }, []);

  return (
    <div className="p-6">
      {/* ✅ Search handles filtering internally */}
      <SearchBar recipes={recipes} onResults={setFilteredRecipes} />

      {/* ✅ Render Results */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition">
              <img src={recipe.image} alt={recipe.name} className="h-40 w-full object-cover rounded-t-xl" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{recipe.name}</h2>
                <p className="text-sm text-gray-500">{recipe.cuisine}</p>
                <p className="text-sm text-gray-500">
                  ⏱ {recipe.cookTimeMinutes} mins | ⭐ {recipe.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No recipes found 😢</p>
      )}
    </div>
  );
}
