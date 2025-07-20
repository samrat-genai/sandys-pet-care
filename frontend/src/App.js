import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import OrderStatus from './components/OrderStatus';

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <OrderProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/track-order" element={<OrderStatus />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        </OrderProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;