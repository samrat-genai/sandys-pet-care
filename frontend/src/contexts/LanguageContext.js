import React, { createContext, useContext, useState } from 'react';
import { bengaliTranslations } from '../translations/bengali';

const LanguageContext = createContext();

const englishTranslations = {
  // Navigation
  home: "Home",
  products: "Products", 
  cart: "Cart",
  
  // Home page
  welcome: "Welcome to Sandy's Pet Care Solution",
  welcomeMessage: "Your one-stop shop for all your pet needs!",
  featuredCategories: "Featured Categories",
  
  // Categories
  dogSupplies: "Dog Supplies",
  catSupplies: "Cat Supplies",
  birdSupplies: "Bird Supplies", 
  fishAquarium: "Fish & Aquarium",
  smallAnimals: "Small Animals",
  
  // Products page
  ourProducts: "Our Products",
  loadingProducts: "Loading products...",
  addToCart: "Add to Cart",
  
  // Cart page
  shoppingCart: "Shopping Cart",
  cartEmpty: "Your cart is empty",
  
  // Common
  loading: "Loading...",
  error: "Error",
  price: "Price",
  
  // Error messages
  failedToLoadProducts: "Failed to load products. Please check if the backend server is running.",
  
  // Footer
  copyright: "© 2025 Sandy's Pet Care Solution. All rights reserved.",
  
  // Shipping
  freeShipping: "Free Shipping",
  shippingCost: "Shipping Cost",
  
  // West Bengal specific
  westBengalLocal: "West Bengal Local",
  easternIndia: "Eastern India", 
  allIndia: "All India"
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');
  
  const translations = language === 'bengali' ? bengaliTranslations : englishTranslations;
  
  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'bengali' : 'english');
  };
  
  return (
    <LanguageContext.Provider value={{ language, translations, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};