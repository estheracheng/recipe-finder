export default function SearchBar({ search, setSearch }) {
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
