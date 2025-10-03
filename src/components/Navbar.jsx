export default function Navbar() {
  return (
    <header className="bg-[#F8AFA6] flex justify-between items-center px-6 py-4 shadow-md">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#F8AFA6]">
          CE
        </div>
      </div>
      <nav className="flex gap-6 font-semibold">
        <a href="#" className="underline text-gray-800">Home</a>
        <a href="#" className="text-gray-800 hover:underline">Browse</a>
        <a href="#" className="text-gray-800 hover:underline">Favorites</a>
      </nav>
    </header>
  );
}
