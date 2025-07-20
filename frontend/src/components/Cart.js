import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import PaymentMethods from './PaymentMethods';
import DeliveryAddress from './DeliveryAddress';
import OrderConfirmation from './OrderConfirmation';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { translations, language } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalPriceINR, clearCart } = useCart();
  const { createOrder } = useOrder();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('cart'); // 'cart', 'address', 'payment', 'confirmation'
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const totalAmount = getTotalPrice();
  const totalINR = getTotalPriceINR();

  const handleAddressSubmit = (addressData) => {
    setDeliveryAddress(addressData);
    setCurrentStep('payment');
  };

  const handlePaymentSelect = async (method) => {
    if (method === 'cod') {
      try {
        // Create order object
        const orderData = {
          items: cartItems,
          address: deliveryAddress,
          paymentMethod: 'cash-on-delivery',
          pricing: {
            subtotal: totalINR,
            shipping: 40,
            total: totalINR + 40
          }
        };
        
        // Create the order
        const newOrder = await createOrder(orderData);
        setConfirmedOrder(newOrder);
        setCurrentStep('confirmation');
        
        // Clear the cart
        clearCart();
      } catch (error) {
        console.error('Failed to place order:', error);
        // Handle error - maybe show a notification
      }
    }
  };

  const handleBackToCart = () => {
    setCurrentStep('cart');
  };

  const handleBackToAddress = () => {
    setCurrentStep('address');
  };
  
  const handleContinueShopping = () => {
    setCurrentStep('cart');
    setDeliveryAddress(null);
    setConfirmedOrder(null);
    navigate('/');
  };
  
  const handleTrackOrder = () => {
    navigate('/track-order');
  };

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      padding: '0 20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: currentStep === 'cart' ? '#007bff' : currentStep === 'address' || currentStep === 'payment' ? '#28a745' : '#6c757d'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: currentStep === 'cart' ? '#007bff' : currentStep === 'address' || currentStep === 'payment' ? '#28a745' : '#6c757d',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {currentStep === 'address' || currentStep === 'payment' ? '✓' : '1'}
          </div>
          <span>Cart</span>
        </div>

        <div style={{ width: '40px', height: '2px', backgroundColor: currentStep === 'address' || currentStep === 'payment' ? '#28a745' : '#ddd' }}></div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: currentStep === 'address' ? '#007bff' : currentStep === 'payment' ? '#28a745' : '#6c757d'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: currentStep === 'address' ? '#007bff' : currentStep === 'payment' ? '#28a745' : '#6c757d',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            {currentStep === 'payment' ? '✓' : '2'}
          </div>
          <span>Address</span>
        </div>

        <div style={{ width: '40px', height: '2px', backgroundColor: currentStep === 'payment' ? '#28a745' : '#ddd' }}></div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: currentStep === 'payment' ? '#007bff' : '#6c757d'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: currentStep === 'payment' ? '#007bff' : '#6c757d',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>
            3
          </div>
          <span>Payment</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit',
      minHeight: '70vh' // Ensure proper height to push footer down
    }}>
      {renderStepIndicator()}
      
      {currentStep === 'cart' && (
        <div>
          <h1>{translations.shoppingCart}</h1>
      
      {cartItems.length === 0 ? (
        <p>{translations.cartEmpty}</p>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            {cartItems.map(item => (
              <div key={item._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '10px',
                backgroundColor: '#fff'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{item.description}</p>
                  <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#e74c3c' }}>
                    ₹{(item.price * 83).toFixed(2)} each
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px',
                  minWidth: '200px',
                  justifyContent: 'flex-end'
                }}>
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #ddd',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      -
                    </button>
                    <span style={{ 
                      minWidth: '30px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #ddd',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Total Price for this item */}
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <p style={{ margin: '0', fontWeight: 'bold', fontSize: '16px' }}>
                      ₹{(item.price * item.quantity * 83).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal:</span>
              <span>₹{totalINR.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping:</span>
              <span>₹40.00</span>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>₹{(totalINR + 40).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => clearCart()}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '15px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                flex: '0 0 auto'
              }}
            >
              Clear Cart
            </button>
            
            <button 
              onClick={() => setCurrentStep('address')}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '15px 30px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
        </div>
      )}

      {currentStep === 'address' && (
        <DeliveryAddress 
          onAddressSubmit={handleAddressSubmit}
          onBack={handleBackToCart}
        />
      )}

      {currentStep === 'payment' && (
        <div>
          <h1>Payment</h1>
          
          {/* Order Summary */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            maxWidth: '600px',
            margin: '0 auto 20px auto'
          }}>
            <h3>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Items ({cartItems.length}):</span>
              <span>₹{totalINR.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping:</span>
              <span>₹40.00</span>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>₹{(totalINR + 40).toFixed(2)}</span>
            </div>
            
            {/* Delivery Address Summary */}
            {deliveryAddress && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '6px' }}>
                <strong>📍 Delivery Address:</strong>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  {deliveryAddress.fullName} • {deliveryAddress.phone}
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  {deliveryAddress.addressLine1}, {deliveryAddress.addressLine2 && `${deliveryAddress.addressLine2}, `}
                  {deliveryAddress.city}, {deliveryAddress.district}, {deliveryAddress.state} - {deliveryAddress.pinCode}
                </p>
                <button
                  onClick={handleBackToAddress}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#007bff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    marginTop: '5px'
                  }}
                >
                  Change Address
                </button>
              </div>
            )}
          </div>

          <PaymentMethods onSelectPayment={handlePaymentSelect} orderAmount={totalAmount} />
        </div>
      )}
      
      {currentStep === 'confirmation' && confirmedOrder && (
        <OrderConfirmation 
          order={confirmedOrder}
          onContinueShopping={handleContinueShopping}
          onTrackOrder={handleTrackOrder}
        />
      )}
    </div>
  );
};

export default Cart;