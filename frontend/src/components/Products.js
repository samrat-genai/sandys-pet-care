import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const { translations, language } = useLanguage();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(translations.failedToLoadProducts);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [translations]);

  // Filter products when category or products change
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category === getBackendCategory(selectedCategory)
      );
      setFilteredProducts(filtered);
    }
  }, [products, selectedCategory]);

  const getBackendCategory = (frontendCategory) => {
    const categoryMap = {
      'dog': 'dogs',
      'cat': 'cats',
      'bird': 'birds',
      'fish': 'fish',
      'small-animals': 'small-animals',
      'reptiles': 'reptiles'
    };
    return categoryMap[frontendCategory] || frontendCategory;
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product) => {
    setAddingToCart(prev => ({ ...prev, [product._id]: true }));
    
    try {
      addToCart(product);
      
      // Show success feedback briefly
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [product._id]: false }));
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(prev => ({ ...prev, [product._id]: false }));
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit' }}>{translations.loadingProducts}</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '40px', fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit' }}>
        <h1>{translations.ourProducts}</h1>
        <div style={{ color: 'red', padding: '20px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#fee' }}>
          {error}
        </div>
      </div>
    );
  }

  const getCategoryDisplayName = (category) => {
    const names = {
      'all': 'All Products',
      'dog': 'Dog Supplies',
      'cat': 'Cat Supplies',
      'bird': 'Bird Supplies',
      'fish': 'Fish & Aquarium',
      'small-animals': 'Small Animals',
      'reptiles': 'Reptiles'
    };
    return names[category] || 'All Products';
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit',
      minHeight: 'calc(100vh - 200px)', // Subtract approximate header + footer height
      flex: 1
    }}>
      <h1>{translations.ourProducts}</h1>
      
      {/* Category Filter Buttons */}
      <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {['all', 'dog', 'cat', 'bird', 'fish', 'small-animals', 'reptiles'].map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              padding: '10px 20px',
              border: '2px solid #007bff',
              borderRadius: '25px',
              backgroundColor: selectedCategory === category ? '#007bff' : 'white',
              color: selectedCategory === category ? 'white' : '#007bff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>

      {/* Category Info */}
      <div style={{ marginBottom: '20px', color: '#666' }}>
        <p>Showing <strong>{filteredProducts.length}</strong> products in <strong>{getCategoryDisplayName(selectedCategory)}</strong></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredProducts.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>₹{(product.price * 83).toFixed(2)}</p>
            <button 
              onClick={() => handleAddToCart(product)}
              disabled={addingToCart[product._id]}
              style={{ 
                backgroundColor: addingToCart[product._id] ? '#28a745' : '#007bff', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: addingToCart[product._id] ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: addingToCart[product._id] ? 0.8 : 1
              }}
            >
              {addingToCart[product._id] ? '✓ Added!' : translations.addToCart}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;