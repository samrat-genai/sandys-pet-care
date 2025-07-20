import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { translations } = useLanguage();
  const { getTotalItems } = useCart();
  
  const cartItemCount = getTotalItems();
  
  return (
    <header className="App-header">
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div>
          <Link to="/" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
            {translations.home}
          </Link>
          <Link to="/products" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
            {translations.products}
          </Link>
          <Link to="/cart" style={{ 
            margin: '0 10px', 
            color: 'white', 
            textDecoration: 'none',
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            {translations.cart}
            {cartItemCount > 0 && (
              <span style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link to="/track-order" style={{ margin: '0 10px', color: 'white', textDecoration: 'none' }}>
            Track Order
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;