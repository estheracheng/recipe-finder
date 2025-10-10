import React, { createContext, useContext, useState, useEffect } from 'react';

const ShoppingListContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);

  // Load shopping list from localStorage on component mount
  useEffect(() => {
    const savedList = localStorage.getItem('recipeShoppingList');
    if (savedList) {
      try {
        setShoppingList(JSON.parse(savedList));
      } catch (error) {
        console.error('Error parsing shopping list from localStorage:', error);
        setShoppingList([]);
      }
    }
  }, []);

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recipeShoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToShoppingList = (ingredients, recipeName = '') => {
    setShoppingList(prev => {
      const newItems = ingredients.map(ingredient => ({
        id: Math.random().toString(36).substr(2, 9),
        name: ingredient,
        checked: false,
        recipe: recipeName,
        addedAt: new Date().toISOString()
      }));

      // Merge with existing items, avoiding duplicates
      const mergedList = [...prev];
      newItems.forEach(newItem => {
        const existingIndex = mergedList.findIndex(
          item => item.name.toLowerCase() === newItem.name.toLowerCase() && !item.checked
        );
        if (existingIndex === -1) {
          mergedList.push(newItem);
        }
      });

      return mergedList;
    });
  };

  const removeFromShoppingList = (itemId) => {
    setShoppingList(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleItemChecked = (itemId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearCheckedItems = () => {
    setShoppingList(prev => prev.filter(item => !item.checked));
  };

  const clearAllItems = () => {
    setShoppingList([]);
  };

  const addSingleItem = (itemName) => {
    if (!itemName.trim()) return;
    
    setShoppingList(prev => {
      const existingIndex = prev.findIndex(
        item => item.name.toLowerCase() === itemName.toLowerCase() && !item.checked
      );
      if (existingIndex !== -1) {
        return prev;
      }
      return [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: itemName.trim(),
          checked: false,
          recipe: 'Manual addition',
          addedAt: new Date().toISOString()
        }
      ];
    });
  };

  const contextValue = {
    shoppingList,
    addToShoppingList,
    removeFromShoppingList,
    toggleItemChecked,
    clearCheckedItems,
    clearAllItems,
    addSingleItem
  };

  return (
    <ShoppingListContext.Provider value={contextValue}>
      {children}
    </ShoppingListContext.Provider>
  );
};