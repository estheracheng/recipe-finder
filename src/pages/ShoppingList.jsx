import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingList } from "../context/ShoppingListContext";
import { Check, Trash2, Plus, ShoppingCart, Download, Share2, ArrowRight, ChefHat, Calendar, BarChart3, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ShoppingList() {
  const navigate = useNavigate();
  const {
    shoppingList,
    removeFromShoppingList,
    toggleItemChecked,
    clearCheckedItems,
    clearAllItems,
    addSingleItem
  } = useShoppingList();

  const [newItem, setNewItem] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState("added"); // "added", "name", "recipe"

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      addSingleItem(newItem);
      setNewItem("");
    }
  };

  const checkedItems = shoppingList.filter(item => item.checked);
  const uncheckedItems = shoppingList.filter(item => !item.checked);

  // Sort items
  const sortedUncheckedItems = [...uncheckedItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "recipe":
        return (a.recipe || '').localeCompare(b.recipe || '');
      default:
        return new Date(a.addedAt) - new Date(b.addedAt);
    }
  });

  const sortedCheckedItems = [...checkedItems].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "recipe":
        return (a.recipe || '').localeCompare(b.recipe || '');
      default:
        return new Date(a.addedAt) - new Date(b.addedAt);
    }
  });

  const exportShoppingList = () => {
    const listText = shoppingList
      .map(item => `${item.checked ? '✅' : '◻️'} ${item.name}${item.recipe ? ` (from: ${item.recipe})` : ''}`)
      .join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareShoppingList = async () => {
    const listText = `🛒 My Shopping List\n\n${shoppingList
      .map(item => `${item.checked ? '✅' : '◻️'} ${item.name}${item.recipe ? ` (from: ${item.recipe})` : ''}`)
      .join('\n')}\n\nTotal: ${uncheckedItems.length} items to buy`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Shopping List',
          text: listText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(listText);
      alert('Shopping list copied to clipboard!');
    }
  };

  // Calculate statistics
  const stats = {
    total: shoppingList.length,
    pending: uncheckedItems.length,
    completed: checkedItems.length,
    completionRate: shoppingList.length > 0 ? Math.round((checkedItems.length / shoppingList.length) * 100) : 0,
    recipes: [...new Set(shoppingList.map(item => item.recipe).filter(Boolean))].length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#F8AFA6] py-12 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingCart className="w-10 h-10 text-[#F8AFA6]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Shopping List</h1>
            <p className="text-gray-700 text-lg">
              {shoppingList.length === 0 
                ? "Your grocery shopping companion" 
                : `${stats.pending} items to buy • ${stats.completed} completed`
              }
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Quick Stats */}
          {shoppingList.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={<ShoppingCart className="w-5 h-5" />}
                value={stats.total}
                label="Total Items"
                color="text-blue-600"
              />
              <StatCard 
                icon={<Check className="w-5 h-5" />}
                value={stats.pending}
                label="To Buy"
                color="text-orange-600"
              />
              <StatCard 
                icon={<BarChart3 className="w-5 h-5" />}
                value={`${stats.completionRate}%`}
                label="Completed"
                color="text-green-600"
              />
              <StatCard 
                icon={<ChefHat className="w-5 h-5" />}
                value={stats.recipes}
                label="Recipes"
                color="text-purple-600"
              />
            </div>
          )}

          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="What do you need to buy? (e.g., tomatoes, olive oil, flour...)"
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white shadow-sm"
              />
              <button
                type="submit"
                className="bg-[#F8AFA6] text-gray-800 px-6 py-3 rounded-2xl hover:bg-[#f5978d] transition-colors flex items-center gap-2 font-semibold shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add
              </button>
            </div>
          </form>

          {/* Controls */}
          {shoppingList.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F8AFA6] focus:border-transparent bg-white text-sm"
                  >
                    <option value="added">Sort by Added</option>
                    <option value="name">Sort by Name</option>
                    <option value="recipe">Sort by Recipe</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
                </div>

                {/* Toggle Completed */}
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    showCompleted 
                      ? 'bg-[#F8AFA6] text-gray-800' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {showCompleted ? 'Hide Completed' : 'Show Completed'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportShoppingList}
                  className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={shareShoppingList}
                  className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}

          {/* Shopping List Items */}
          <div className="space-y-3">
            {/* Pending Items */}
            {sortedUncheckedItems.map(item => (
              <ShoppingListItem 
                key={item.id}
                item={item}
                onToggle={() => toggleItemChecked(item.id)}
                onRemove={() => removeFromShoppingList(item.id)}
                checked={false}
              />
            ))}

            {/* Completed Items */}
            {showCompleted && sortedCheckedItems.length > 0 && (
              <>
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Completed ({sortedCheckedItems.length})
                    </h3>
                    <button
                      onClick={clearCheckedItems}
                      className="text-xs text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear All
                    </button>
                  </div>
                </div>
                {sortedCheckedItems.map(item => (
                  <ShoppingListItem 
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItemChecked(item.id)}
                    onRemove={() => removeFromShoppingList(item.id)}
                    checked={true}
                  />
                ))}
              </>
            )}
          </div>

          {/* Bulk Actions */}
          {shoppingList.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
              {checkedItems.length > 0 && (
                <button
                  onClick={clearCheckedItems}
                  className="bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 hover:bg-green-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  Clear Completed ({checkedItems.length})
                </button>
              )}
              <button
                onClick={clearAllItems}
                className="bg-red-50 text-red-700 px-4 py-2 rounded-full border border-red-200 hover:bg-red-100 transition-colors flex items-center gap-2 text-sm ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Items
              </button>
            </div>
          )}

          {/* Empty State */}
          {shoppingList.length === 0 && (
            <EmptyShoppingListState onBrowseClick={() => navigate('/browse')} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Shopping List Item Component
const ShoppingListItem = ({ item, onToggle, onRemove, checked }) => (
  <div
    className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 group transition-all ${
      checked ? 'opacity-75' : 'hover:shadow-md'
    }`}
  >
    <button
      onClick={onToggle}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        checked 
          ? 'bg-green-500 border-green-500 text-white' 
          : 'border-gray-300 hover:border-[#F8AFA6] hover:bg-[#F8AFA6]/10'
      }`}
    >
      {checked && <Check className="w-4 h-4" />}
    </button>
    
    <div className="flex-1 min-w-0">
      <p className={`text-gray-800 font-medium ${checked ? 'line-through' : ''}`}>
        {item.name}
      </p>
      {item.recipe && (
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <ChefHat className="w-3 h-3" />
          From: {item.recipe}
        </p>
      )}
      {item.addedAt && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <Calendar className="w-3 h-3" />
          Added {new Date(item.addedAt).toLocaleDateString()}
        </p>
      )}
    </div>
    
    <button
      onClick={onRemove}
      className={`p-2 text-gray-400 hover:text-red-500 transition-colors ${
        checked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
      title="Remove item"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

// Empty State Component
const EmptyShoppingListState = ({ onBrowseClick }) => (
  <div className="text-center py-16">
    <div className="w-32 h-32 bg-[#F8AFA6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
      <ShoppingCart className="w-16 h-16 text-white" />
    </div>
    <h3 className="text-3xl font-bold text-gray-800 mb-3">Your shopping list is empty</h3>
    <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
      Start building your shopping list by adding ingredients from recipes or manually adding items you need to buy.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        onClick={onBrowseClick}
        className="bg-[#F8AFA6] text-gray-800 px-8 py-4 rounded-full hover:bg-[#f5978d] transition-colors font-semibold text-lg flex items-center gap-2 shadow-sm"
      >
        Browse Recipes
        <ArrowRight className="w-5 h-5" />
      </button>
      <button 
        onClick={() => document.querySelector('input')?.focus()}
        className="bg-white text-gray-700 px-8 py-4 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors font-semibold text-lg flex items-center gap-2 shadow-sm"
      >
        <Plus className="w-5 h-5" />
        Add First Item
      </button>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
    <div className={`${color} mb-2 flex justify-center`}>
      {icon}
    </div>
    <div className="text-xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);