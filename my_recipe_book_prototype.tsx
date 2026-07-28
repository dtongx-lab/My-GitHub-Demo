import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, Book, Heart, ShoppingCart, Settings, Plus, Search, 
  Star, Clock, Users, ChefHat, Edit, Trash, ChevronLeft, Moon, Sun, Filter, Camera, Loader2, Sparkles, Send, Printer, FileText, Download, Menu, X
} from 'lucide-react';

const apiKey = "";

const initialRecipes = [
  { 
    id: 1, 
    name: "Classic Avocado Toast", 
    category: "Breakfast", 
    cuisine: "American",
    prepTime: 5, 
    cookTime: 5, 
    servings: 1, 
    difficulty: "Easy", 
    rating: 5, 
    isFavorite: true, 
    ingredients: [
      { amount: 1, unit: "slice", item: "Sourdough bread" }, 
      { amount: 0.5, unit: "whole", item: "Avocado" }, 
      { amount: 1, unit: "pinch", item: "Sea salt" }, 
      { amount: 1, unit: "pinch", item: "Red pepper flakes" },
      { amount: 1, unit: "tsp", item: "Olive oil" }
    ], 
    instructions: [
      "Toast the sourdough bread to your desired level of crispiness.", 
      "While the bread is toasting, halve the avocado and scoop out the flesh.", 
      "Mash the avocado with a fork until mostly smooth but slightly chunky.", 
      "Spread the mashed avocado evenly over the toasted bread.",
      "Drizzle with olive oil and sprinkle with sea salt and red pepper flakes."
    ], 
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80",
    dateCreated: new Date().toISOString()
  },
  { 
    id: 2, 
    name: "Creamy Tomato Soup", 
    category: "Soups", 
    cuisine: "Italian",
    prepTime: 10, 
    cookTime: 30, 
    servings: 4, 
    difficulty: "Medium", 
    rating: 4, 
    isFavorite: false, 
    ingredients: [
      { amount: 2, unit: "tbsp", item: "Butter" }, 
      { amount: 1, unit: "medium", item: "Onion, chopped" }, 
      { amount: 2, unit: "cloves", item: "Garlic, minced" }, 
      { amount: 28, unit: "oz", item: "Crushed tomatoes" },
      { amount: 1, unit: "cup", item: "Vegetable broth" },
      { amount: 0.5, unit: "cup", item: "Heavy cream" }
    ], 
    instructions: [
      "Melt butter in a large pot over medium heat. Add onions and cook until soft.", 
      "Add garlic and cook for 1 minute until fragrant.", 
      "Pour in crushed tomatoes and vegetable broth. Bring to a simmer.", 
      "Reduce heat and let simmer for 20 minutes.",
      "Stir in heavy cream and blend with an immersion blender until smooth.",
      "Season with salt and pepper to taste."
    ], 
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    dateCreated: new Date().toISOString()
  },
  { 
    id: 3, 
    name: "Grilled Lemon Herb Chicken", 
    category: "Dinner", 
    cuisine: "Mediterranean",
    prepTime: 15, 
    cookTime: 15, 
    servings: 2, 
    difficulty: "Easy", 
    rating: 5, 
    isFavorite: true, 
    ingredients: [
      { amount: 2, unit: "whole", item: "Chicken breasts" }, 
      { amount: 2, unit: "tbsp", item: "Olive oil" }, 
      { amount: 1, unit: "whole", item: "Lemon, juiced" }, 
      { amount: 1, unit: "tbsp", item: "Fresh rosemary, chopped" },
      { amount: 2, unit: "cloves", item: "Garlic, minced" }
    ], 
    instructions: [
      "In a bowl, whisk together olive oil, lemon juice, rosemary, garlic, salt, and pepper.", 
      "Place chicken breasts in a ziplock bag and pour the marinade over them.", 
      "Seal the bag and let marinate in the fridge for at least 30 minutes.", 
      "Preheat grill to medium-high heat.",
      "Grill chicken for 6-7 minutes per side, or until internal temperature reaches 165°F.",
      "Let rest for 5 minutes before slicing."
    ], 
    image: "https://images.unsplash.com/photo-1598515022228-51214eb71dc7?auto=format&fit=crop&w=800&q=80",
    dateCreated: new Date().toISOString()
  }
];

const categories = [
  "Breakfast", "Lunch", "Dinner", "Dessert", "Appetizers", 
  "Soups", "Sauces", "Drinks", "Holiday", "BBQ"
];

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [view, setView] = useState('dashboard'); // dashboard, list, detail, form, ai
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived state
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            recipe.ingredients.some(i => i.item?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = 
        activeCategory === 'All' ? true :
        activeCategory === 'Favorites' ? !!recipe.isFavorite :
        recipe.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, activeCategory]);

  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const recentRecipes = [...recipes].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)).slice(0, 3);

  // Handlers
  const toggleFavorite = (id) => {
    setRecipes(recipes.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
    if (activeRecipe && activeRecipe.id === id) {
      setActiveRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const deleteRecipe = (id) => {
    if(window.confirm("Are you sure you want to delete this recipe?")) {
      setRecipes(recipes.filter(r => r.id !== id));
      setView('list');
    }
  };

  const saveRecipe = (newRecipe) => {
    if (newRecipe.id) {
      setRecipes(recipes.map(r => r.id === newRecipe.id ? newRecipe : r));
    } else {
      setRecipes([...recipes, { ...newRecipe, id: Date.now(), dateCreated: new Date().toISOString() }]);
    }
    setView('list');
  };

  const navigateTo = (targetView, category = 'All') => {
    setView(targetView);
    setActiveCategory(category);
    setMobileMenuOpen(false);
  };

  // --- Sub-components ---

  const NavigationContent = () => (
    <>
      <div className="p-5 md:p-6 flex items-center justify-between border-b md:border-b-0 border-gray-100 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <ChefHat size={28} />
          Recipe Book
        </h1>
        <button 
          type="button" 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-2 py-4">
        <button type="button" onClick={() => navigateTo('dashboard', 'All')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${view === 'dashboard' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Home size={20} /> Dashboard
        </button>
        <button type="button" onClick={() => navigateTo('list', 'All')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${view === 'list' && activeCategory === 'All' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Book size={20} /> All Recipes
        </button>
        <button type="button" onClick={() => navigateTo('list', 'Favorites')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${view === 'list' && activeCategory === 'Favorites' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Heart size={20} /> Favorites
        </button>
        <button type="button" onClick={() => navigateTo('ai', 'All')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${view === 'ai' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
          <Sparkles size={20} /> AI Assistant
        </button>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={() => setIsDarkMode(!isDarkMode)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </>
  );

  const AIAssistantView = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAskAI = async (e) => {
      e.preventDefault();
      if (!prompt.trim()) return;

      setLoading(true);
      setResponse('');

      const systemPrompt = "You are a professional culinary chef and assistant embedded in 'My Recipe Book'. Help the user with cooking tips, flavor pairings, seasoning adjustments, or drafting custom recipes based on their prompt.";
      
      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const delays = [1000, 2000, 4000, 8000, 16000];
      let apiResult = null;

      for (let i = 0; i < 5; i++) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: systemPrompt }] }
            })
          });

          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          apiResult = await res.json();
          break;
        } catch (err) {
          if (i === 4) throw err;
          await sleep(delays[i]);
        }
      }

      const text = apiResult?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request right now.";
      setResponse(text);
      setLoading(false);
    };

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={28} />
            <h2 className="text-2xl sm:text-3xl font-bold">✨ Gemini AI Kitchen Assistant</h2>
          </div>
          <p className="text-purple-100 text-sm sm:text-base">Ask for seasoning recommendations, recipe variations, spice substitutions, or fresh meal ideas.</p>
        </div>

        <form onSubmit={handleAskAI} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">What would you like help with?</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={prompt ?? ''}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., What spices pair best with sesame dressing?"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm sm:text-base"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm sm:text-base"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Ask ✨
              </button>
            </div>
          </div>
        </form>

        {(loading || response) && (
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" /> Chef's Response
            </h3>
            {loading ? (
              <div className="flex items-center gap-3 py-6 text-gray-500 dark:text-gray-400">
                <Loader2 size={24} className="animate-spin text-purple-600" />
                <span>Thinking up culinary advice...</span>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {response}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const RecipeCard = ({ recipe }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-200 group"
      onClick={() => { setActiveRecipe(recipe); setView('detail'); }}
    >
      <div className="h-44 sm:h-48 overflow-hidden relative">
        <img src={recipe.image || "/api/placeholder/400/300"} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
          className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white transition-colors cursor-pointer"
        >
          <Heart size={18} className={recipe.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"} />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200">
          {recipe.category}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{recipe.name}</h3>
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1"><Clock size={15} /> {(Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0)}m</span>
          <span className="flex items-center gap-1"><Users size={15} /> {recipe.servings}</span>
          <span className="flex items-center gap-1 text-yellow-500"><Star size={15} className="fill-yellow-500" /> {recipe.rating}</span>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 sm:p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800 cursor-pointer" onClick={() => { setView('list'); setActiveCategory('All'); }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl"><Book size={22} /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-200">Total Recipes</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-emerald-100">{recipes.length}</h2>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 sm:p-6 rounded-2xl border border-blue-100 dark:border-blue-800 cursor-pointer" onClick={() => { setView('list'); setActiveCategory('Favorites'); }}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 rounded-xl"><Heart size={22} /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">Favorites</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{favoriteRecipes.length}</h2>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 sm:p-6 rounded-2xl border border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400 rounded-xl"><ChefHat size={22} /></div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-200">Categories</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">
                {new Set(recipes.map(r => r.category)).size}
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recently Added</h2>
          <button type="button" onClick={() => { setView('list'); setActiveCategory('All'); }} className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium hover:underline cursor-pointer">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      </div>
    </div>
  );

  const RecipeDetail = () => {
    const [scale, setScale] = useState(1);
    const [showPrintMenu, setShowPrintMenu] = useState(false);
    
    if (!activeRecipe) return null;

    const handlePrintToPrinter = () => {
      setShowPrintMenu(false);
      window.print();
    };

    const handleSaveToFile = () => {
      setShowPrintMenu(false);
      const content = `
RECIPE: ${activeRecipe.name}
Category: ${activeRecipe.category} | Difficulty: ${activeRecipe.difficulty}
Prep Time: ${activeRecipe.prepTime} mins | Cook Time: ${activeRecipe.cookTime} mins | Servings: ${activeRecipe.servings}

INGREDIENTS:
${activeRecipe.ingredients.map(i => `- ${i.amount ?? ''} ${i.unit ?? ''} ${i.item ?? ''}`).join('\n')}

INSTRUCTIONS:
${activeRecipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}
      `.trim();

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${activeRecipe.name.toLowerCase().replace(/\s+/g, '_')}_recipe.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in duration-300">
        <div className="relative h-64 sm:h-80 md:h-96">
          {/* Mobile Back Button top-left for fast navigation on phone */}
          <button 
            type="button" 
            onClick={() => setView('list')} 
            title="Back to recipes"
            className="absolute top-4 left-4 z-20 p-2.5 sm:p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white text-gray-800 dark:text-white transition-colors shadow-sm cursor-pointer flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Action buttons bar grouped cleanly top-right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 sm:gap-2">
            {/* Favorite Toggle Button */}
            <button 
              type="button" 
              onClick={() => toggleFavorite(activeRecipe.id)} 
              title={activeRecipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="p-2.5 sm:p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white text-gray-800 dark:text-white transition-colors shadow-sm cursor-pointer flex items-center justify-center"
            >
              <Heart size={18} className={activeRecipe.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"} />
            </button>

            {/* Print Options Dropdown Container */}
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setShowPrintMenu(!showPrintMenu)} 
                title="Print Options" 
                className="p-2.5 sm:p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white text-gray-800 dark:text-white transition-colors shadow-sm cursor-pointer flex items-center justify-center"
              >
                <Printer size={18} />
              </button>

              {showPrintMenu && (
                <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button 
                    type="button"
                    onClick={handlePrintToPrinter}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center gap-3 cursor-pointer"
                  >
                    <Printer size={16} className="text-emerald-600 dark:text-emerald-400" /> Print to Printer
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveToFile}
                    className="w-full px-4 py-2.5 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center gap-3 cursor-pointer border-t border-gray-100 dark:border-gray-600"
                  >
                    <Download size={16} className="text-emerald-600 dark:text-emerald-400" /> Save to File / PDF
                  </button>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <button 
              type="button" 
              onClick={() => setView('form')} 
              title="Edit Recipe" 
              className="p-2.5 sm:p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white text-gray-800 dark:text-white transition-colors shadow-sm cursor-pointer flex items-center justify-center"
            >
              <Edit size={18} />
            </button>

            {/* Delete Button */}
            <button 
              type="button" 
              onClick={() => deleteRecipe(activeRecipe.id)} 
              title="Delete Recipe" 
              className="p-2.5 sm:p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-full hover:bg-white text-red-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
            >
              <Trash size={18} />
            </button>
          </div>

          <img src={activeRecipe.image || "/api/placeholder/800/400"} alt={activeRecipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8 text-white">
            <div className="flex gap-2 mb-2 sm:mb-3">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">{activeRecipe.category}</span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">{activeRecipe.difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">{activeRecipe.name}</h1>
            <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-200">
              <span className="flex items-center gap-1.5"><Clock size={16} /> Prep: {activeRecipe.prepTime}m | Cook: {activeRecipe.cookTime}m</span>
              <span className="flex items-center gap-1.5"><Users size={16} /> {activeRecipe.servings} Servings</span>
              <span className="flex items-center gap-1.5 text-yellow-400"><Star size={16} className="fill-yellow-400" /> {activeRecipe.rating} / 5</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          <div className="md:col-span-1 space-y-6 sm:space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Ingredients</h3>
                <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  {[1, 2, 3].map(mult => (
                    <button key={mult} type="button" onClick={() => setScale(mult)} className={`px-2.5 py-1 rounded text-xs sm:text-sm font-medium transition-colors cursor-pointer ${scale === mult ? 'bg-white dark:bg-gray-600 shadow text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                      {mult}x
                    </button>
                  ))}
                </div>
              </div>
              <ul className="space-y-2.5 sm:space-y-3">
                {activeRecipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex justify-between items-center py-1.5 sm:py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 text-sm sm:text-base">
                    <span className="text-gray-700 dark:text-gray-300">{ing.item}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 pl-2 text-right">
                      {ing.amount ? (Number(ing.amount) * scale).toPrecision(2).replace(/\.0+$/, '') : ''} {ing.unit ?? ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">Instructions</h3>
            <ol className="space-y-4 sm:space-y-6">
              {activeRecipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 sm:gap-4">
                  <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full font-bold text-xs sm:text-sm">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 pt-0.5 leading-relaxed text-sm sm:text-base">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  };

  const RecipeForm = () => {
    const isEditing = !!activeRecipe;
    const [formData, setFormData] = useState(() => isEditing ? {
      ...activeRecipe,
      name: activeRecipe.name ?? '',
      category: activeRecipe.category ?? 'Dinner',
      cuisine: activeRecipe.cuisine ?? '',
      prepTime: activeRecipe.prepTime ?? 15,
      cookTime: activeRecipe.cookTime ?? 30,
      servings: activeRecipe.servings ?? 4,
      difficulty: activeRecipe.difficulty ?? 'Medium',
      rating: activeRecipe.rating ?? 5,
      isFavorite: !!activeRecipe.isFavorite,
      image: activeRecipe.image ?? '',
      ingredients: activeRecipe.ingredients?.length ? activeRecipe.ingredients.map(i => ({ amount: i.amount ?? '', unit: i.unit ?? '', item: i.item ?? '' })) : [{ amount: 1, unit: 'cup', item: '' }],
      instructions: activeRecipe.instructions?.length ? [...activeRecipe.instructions] : ['']
    } : {
      name: '', category: 'Dinner', cuisine: '', prepTime: 15, cookTime: 30, servings: 4, difficulty: 'Medium', rating: 5, isFavorite: false, image: '',
      ingredients: [{ amount: 1, unit: 'cup', item: '' }],
      instructions: ['']
    });

    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleIngredientChange = (index, field, value) => {
      const newIng = [...formData.ingredients];
      newIng[index][field] = value;
      setFormData({ ...formData, ingredients: newIng });
    };

    const handleInstructionChange = (index, value) => {
      const newInst = [...formData.instructions];
      newInst[index] = value;
      setFormData({ ...formData, instructions: newInst });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      saveRecipe(formData);
    };

    const handleImageUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        setFormData(prev => ({ ...prev, image: base64String }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    const handleImageScan = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsScanning(true);
      
      try {
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        const mimeType = file.type;
        const base64Data = base64String.split(',')[1];

        const prompt = `Analyze this recipe image (handwritten or digital). Extract the recipe and return it as a structured JSON object. Format exactly like this:
        {
          "name": "Recipe Name",
          "category": "Breakfast, Lunch, Dinner, Dessert, Appetizers, Soups, Sauces, Drinks, Holiday, or BBQ",
          "prepTime": 15,
          "cookTime": 30,
          "servings": 4,
          "difficulty": "Easy",
          "ingredients": [{"amount": 1, "unit": "cup", "item": "Flour"}],
          "instructions": ["Step 1", "Step 2"]
        }`;

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const delays = [1000, 2000, 4000, 8000, 16000];
        let result = null;

        for (let i = 0; i < 5; i++) {
          try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  role: "user",
                  parts: [
                    { text: prompt },
                    { inlineData: { mimeType: mimeType, data: base64Data } }
                  ]
                }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      category: { type: "STRING" },
                      cuisine: { type: "STRING" },
                      prepTime: { type: "INTEGER" },
                      cookTime: { type: "INTEGER" },
                      servings: { type: "INTEGER" },
                      difficulty: { type: "STRING" },
                      ingredients: { 
                        type: "ARRAY", 
                        items: { 
                          type: "OBJECT", 
                          properties: { 
                            amount: { type: "NUMBER" }, 
                            unit: { type: "STRING" }, 
                            item: { type: "STRING" } 
                          } 
                        } 
                      },
                      instructions: { type: "ARRAY", items: { type: "STRING" } }
                    }
                  }
                }
              })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            result = await response.json();
            break; 
          } catch (err) {
            if (i === 4) throw err;
            await sleep(delays[i]);
          }
        }

        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          let jsonText = result.candidates[0].content.parts[0].text;
          jsonText = jsonText.replace(/```json/gi, '').replace(/```/g, '').trim();
          
          const parsedData = JSON.parse(jsonText);
          
          setFormData(prev => ({
            ...prev,
            name: parsedData.name ?? prev.name,
            category: parsedData.category ?? prev.category,
            cuisine: parsedData.cuisine ?? prev.cuisine,
            prepTime: parsedData.prepTime ?? prev.prepTime,
            cookTime: parsedData.cookTime ?? prev.cookTime,
            servings: parsedData.servings ?? prev.servings,
            difficulty: parsedData.difficulty ?? prev.difficulty,
            image: base64String,
            ingredients: parsedData.ingredients?.length 
              ? parsedData.ingredients.map(ing => ({ amount: ing.amount ?? '', unit: ing.unit ?? '', item: ing.item ?? '' })) 
              : prev.ingredients,
            instructions: parsedData.instructions?.length ? parsedData.instructions : prev.instructions
          }));
        }
      } catch (error) {
        console.error("Error scanning recipe:", error);
      } finally {
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    return (
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageScan} className="hidden" />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isScanning ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  {isScanning ? 'Scanning...' : 'Scan Image'}
                </button>
              </>
            )}
            <button type="button" onClick={() => setView(isEditing ? 'detail' : 'list')} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-250 cursor-pointer">Cancel</button>
          </div>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Name</label>
            <input required name="name" value={formData.name ?? ''} onChange={handleChange} className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Mom's Spaghetti" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select name="category" value={formData.category ?? 'Dinner'} onChange={handleChange} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-base">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prep (m)</label>
              <input type="number" required name="prepTime" value={formData.prepTime ?? ''} onChange={handleChange} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-base" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cook (m)</label>
              <input type="number" required name="cookTime" value={formData.cookTime ?? ''} onChange={handleChange} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-base" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Servings</label>
              <input type="number" required name="servings" value={formData.servings ?? ''} onChange={handleChange} className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipe Photo</label>
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs sm:text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 dark:file:bg-emerald-900/30 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 cursor-pointer" 
              />
              {formData.image && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">Ingredients</h3>
            <div className="space-y-3">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-3">
                  <input type="number" step="0.1" value={ing.amount ?? ''} onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)} className="w-16 sm:w-24 px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm" placeholder="Amt" />
                  <input value={ing.unit ?? ''} onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)} className="w-20 sm:w-24 px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm" placeholder="Unit" />
                  <input required value={ing.item ?? ''} onChange={(e) => handleIngredientChange(idx, 'item', e.target.value)} className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm" placeholder="Ingredient name" />
                  <button type="button" onClick={() => setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== idx) })} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, ingredients: [...formData.ingredients, { amount: '', unit: '', item: '' }] })} className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-1">
                <Plus size={16} /> Add Ingredient
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">Instructions</h3>
            <div className="space-y-3">
              {formData.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-3">
                  <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-bold text-xs sm:text-sm">
                    {idx + 1}
                  </span>
                  <textarea required rows={2} value={step ?? ''} onChange={(e) => handleInstructionChange(idx, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm resize-none" placeholder="Describe this step..." />
                  <button type="button" onClick={() => setFormData({ ...formData, instructions: formData.instructions.filter((_, i) => i !== idx) })} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg self-start cursor-pointer">
                    <Trash size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setFormData({ ...formData, instructions: [...formData.instructions, ''] })} className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer pt-1">
                <Plus size={16} /> Add Step
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer text-sm sm:text-base">
              {isEditing ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-200 overflow-hidden">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <ChefHat size={24} />
          Recipe Book
        </h1>
        <button 
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen flex-col transition-colors duration-200">
        <NavigationContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-gray-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <NavigationContent />
          </div>
        </div>
      )}

      {/* Main App Content View */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          
          {view !== 'detail' && view !== 'form' && view !== 'ai' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search recipes, ingredients..." 
                  value={searchQuery ?? ''}
                  onChange={(e) => { setSearchQuery(e.target.value); if(view === 'dashboard' && e.target.value) setView('list'); }}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base dark:text-white transition-all"
                />
              </div>
              <button 
                type="button"
                onClick={() => { setActiveRecipe(null); setView('form'); }}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 sm:py-3 rounded-2xl font-semibold shadow-xs transition-colors whitespace-nowrap cursor-pointer text-sm sm:text-base"
              >
                <Plus size={18} /> New Recipe
              </button>
            </div>
          )}

          {view === 'list' && !searchQuery && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 hide-scrollbar">
              <button type="button" onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors cursor-pointer ${activeCategory === 'All' ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>All</button>
              <button type="button" onClick={() => setActiveCategory('Favorites')} className={`px-4 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${activeCategory === 'Favorites' ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Heart size={14} className={activeCategory === 'Favorites' ? 'fill-current' : ''} /> Favorites
              </button>
              {categories.map(c => (
                <button key={c} type="button" onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors cursor-pointer ${activeCategory === c ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-900' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {view === 'dashboard' && !searchQuery && <Dashboard />}
          
          {(view === 'list' || (view === 'dashboard' && searchQuery)) && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory === 'Favorites' ? 'Your Favorites' : activeCategory === 'All' ? 'All Recipes' : `${activeCategory} Recipes`}
                </h2>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{filteredRecipes.length} recipes</span>
              </div>
              
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 mb-4">
                    <Heart size={28} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    {activeCategory === 'Favorites' ? 'You haven\'t marked any recipes as favorite yet. Click the heart icon on any recipe card to add it here.' : 'Try adjusting your search or filters to find what you\'re looking for.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {view === 'detail' && <RecipeDetail />}
          {view === 'form' && <RecipeForm />}
          {view === 'ai' && <AIAssistantView />}

        </div>
      </main>
    </div>
  );
}