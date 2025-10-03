import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`https://dummyjson.com/recipes/${id}`)
      .then(res => res.json())
      .then(data => setRecipe(data));
  }, [id]);

  if (!recipe) return <p className="text-center py-10">Loading...</p>;

  return (
    <main className="flex flex-col items-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full max-w-lg rounded-2xl shadow-md mb-6"
      />

      <div className="flex flex-col items-center space-y-2 mb-6">
        <p className="text-yellow-600">⭐ {recipe.rating}</p>
        <p className="text-gray-600">⏱ {recipe.cookTimeMinutes} mins</p>
        <span className="px-4 py-1 rounded-full bg-pink-200 text-pink-800 font-semibold">
          {recipe.cuisine}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="list-disc pl-6 mb-6">
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i} className="text-gray-700">{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="text-gray-700 max-w-2xl">{recipe.instructions}</p>
    </main>
  );
}
