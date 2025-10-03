import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CuisineRecipes from './pages/CuisineRecipes';
import Browse from './pages/Browse';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetails';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cuisine/:cuisineName" element={<CuisineRecipes />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
        <Route path="/search" element={<SearchResults />} />
        
        {/* Additional pages you might want */}
        <Route path="/about" element={<div className="min-h-screen bg-white flex items-center justify-center"><h1>About Page - Coming Soon</h1></div>} />
        <Route path="/contact" element={<div className="min-h-screen bg-white flex items-center justify-center"><h1>Contact Page - Coming Soon</h1></div>} />
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-[#F8AFA6] text-gray-800 px-6 py-2 rounded-full hover:bg-[#f5978d] transition-colors">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;