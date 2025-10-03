import { useState, useEffect } from "react";

export default function SearchBar({ recipes, onResults }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!search) {
      onResults(recipes); // no search → show all
    } else {
      const lower = search.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(lower) ||
          recipe.cuisine.toLowerCase().includes(lower) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
          recipe.ingredients?.some((ing) => ing.toLowerCase().includes(lower))
      );
      onResults(filtered);
    }
  }, [search, recipes, onResults]);

  return (
    <div className="w-full max-w-xl relative mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search your desired recipe..."
        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
      />
    </div>
  );
}
