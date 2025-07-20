import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const OrderConfirmation = ({ order, onContinueShopping, onTrackOrder }) => {
  const { language } = useLanguage();

  if (!order) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit'
      }}>
        <h2>Order not found</h2>
        <button 
          onClick={onContinueShopping}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 3); // 3 days from order
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '700px',
      margin: '0 auto',
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit'
    }}>
      {/* Success Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '30px',
        backgroundColor: '#d4edda',
        borderRadius: '12px',
        border: '1px solid #c3e6cb'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎉</div>
        <h1 style={{ color: '#155724', margin: '0 0 10px 0' }}>Order Confirmed!</h1>
        <p style={{ color: '#155724', fontSize: '18px', margin: '0' }}>
          Thank you for choosing Sandy's Pet Care Solution
        </p>
      </div>

      {/* Order Details */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '25px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Order Details</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <strong>Order ID:</strong>
            <p style={{ margin: '5px 0', fontSize: '18px', color: '#007bff', fontWeight: 'bold' }}>
              {order.id}
            </p>
          </div>
          <div>
            <strong>Order Date:</strong>
            <p style={{ margin: '5px 0' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <strong>Payment Method:</strong>
            <p style={{ margin: '5px 0' }}>Cash on Delivery (COD)</p>
          </div>
          <div>
            <strong>Estimated Delivery:</strong>
            <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold' }}>
              {getEstimatedDelivery()}
            </p>
          </div>
        </div>
      </div>

      {/* Items Ordered */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Items Ordered</h3>
        
        {order.items.map(item => (
          <div key={item._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #eee'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{item.name}</h4>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                Quantity: {item.quantity} × ₹{(item.price * 83).toFixed(2)}
              </p>
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              ₹{(item.price * item.quantity * 83).toFixed(2)}
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotal:</span>
            <span>₹{order.pricing.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Shipping:</span>
            <span>₹{order.pricing.shipping.toFixed(2)}</span>
          </div>
          <hr style={{ margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Total:</span>
            <span>₹{order.pricing.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div style={{
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '25px'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📍 Delivery Address</h3>
        <div style={{ color: '#495057' }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{order.address?.fullName}</p>
          <p style={{ margin: '5px 0' }}>{order.address?.phone} • {order.address?.email}</p>
          <p style={{ margin: '5px 0' }}>
            {order.address?.addressLine1}
            {order.address?.addressLine2 && `, ${order.address.addressLine2}`}
          </p>
          <p style={{ margin: '5px 0' }}>
            {order.address?.city}, {order.address?.district}, {order.address?.state} - {order.address?.pinCode}
          </p>
          {order.address?.landmark && (
            <p style={{ margin: '5px 0', fontStyle: 'italic' }}>
              Landmark: {order.address.landmark}
            </p>
          )}
        </div>
      </div>

      {/* Important Information */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #ffeaa7',
        marginBottom: '30px'
      }}>
        <h4 style={{ color: '#856404', marginBottom: '15px' }}>📋 Important Information</h4>
        <ul style={{ 
          margin: '0', 
          paddingLeft: '40px', 
          color: '#856404',
          lineHeight: '1.6'
        }}>
          <li style={{ marginBottom: '12px', listStyleType: 'disc' }}>
            Keep your Order ID <strong>{order.id}</strong> safe for tracking
          </li>
          <li style={{ marginBottom: '12px', listStyleType: 'disc' }}>
            Payment will be collected on delivery (COD)
          </li>
          <li style={{ marginBottom: '12px', listStyleType: 'disc' }}>
            Please keep exact change ready
          </li>
          <li style={{ marginBottom: '12px', listStyleType: 'disc' }}>
            Delivery person will call before arrival
          </li>
          <li style={{ marginBottom: '12px', listStyleType: 'disc' }}>
            Order will be delivered within 1-3 business days
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={onTrackOrder}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📦 Track Order
        </button>
        
        <button
          onClick={onContinueShopping}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🛒 Continue Shopping
        </button>
      </div>

      {/* Contact Support */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ margin: '0', color: '#6c757d' }}>
          Need help? Contact us at <strong>support@sandyspetcare.com</strong> or call <strong>+91-9876543210</strong>
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;