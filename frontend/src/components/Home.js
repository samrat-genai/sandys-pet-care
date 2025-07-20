import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { translations, language } = useLanguage();
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit'
    }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '50px',
        padding: '40px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          color: '#2c3e50',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          {translations.welcome}
        </h1>
        <p style={{ 
          fontSize: '1.2rem',
          color: '#6c757d',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          {translations.welcomeMessage}
        </p>
      </div>

      {/* Featured Categories Section */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h3 style={{ 
          fontSize: '2rem',
          color: '#2c3e50',
          marginBottom: '30px'
        }}>
          {translations.featuredCategories}
        </h3>
        
        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          margin: '0 auto',
          maxWidth: '900px'
        }}>
          <div 
            onClick={() => handleCategoryClick('dog')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e74c3c',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐕</div>
            <h4 style={{ color: '#e74c3c', margin: '10px 0' }}>{translations.dogSupplies}</h4>
          </div>
          
          <div 
            onClick={() => handleCategoryClick('cat')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #3498db',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐱</div>
            <h4 style={{ color: '#3498db', margin: '10px 0' }}>{translations.catSupplies}</h4>
          </div>
          
          <div 
            onClick={() => handleCategoryClick('bird')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #f39c12',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐦</div>
            <h4 style={{ color: '#f39c12', margin: '10px 0' }}>{translations.birdSupplies}</h4>
          </div>
          
          <div 
            onClick={() => handleCategoryClick('fish')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #1abc9c',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐠</div>
            <h4 style={{ color: '#1abc9c', margin: '10px 0' }}>{translations.fishAquarium}</h4>
          </div>
          
          <div 
            onClick={() => handleCategoryClick('small-animals')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #9b59b6',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐹</div>
            <h4 style={{ color: '#9b59b6', margin: '10px 0' }}>{translations.smallAnimals}</h4>
          </div>

          <div 
            onClick={() => handleCategoryClick('reptiles')}
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #27ae60',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🦎</div>
            <h4 style={{ color: '#27ae60', margin: '10px 0' }}>Reptiles</h4>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        marginTop: '50px'
      }}>
        <h3 style={{ 
          fontSize: '1.8rem',
          marginBottom: '30px'
        }}>
          Why Choose Sandy's Pet Care Solution?
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🚚</div>
            <h4>Fast Delivery</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>Quick delivery across West Bengal</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆</div>
            <h4>Quality Products</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>Only the best for your pets</p>
          </div>
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💬</div>
            <h4>Expert Support</h4>
            <p style={{ fontSize: '0.9rem', opacity: '0.9' }}>Professional pet care advice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;