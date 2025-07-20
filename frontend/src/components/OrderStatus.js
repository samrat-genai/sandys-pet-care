import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useOrder } from '../contexts/OrderContext';

const OrderStatus = () => {
  const { language } = useLanguage();
  const { getOrderById, getUserOrders, getOrderStatusInfo, updateOrderStatus } = useOrder();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('search'); // 'search', 'order', 'all-orders'

  const handleSearchOrder = () => {
    if (!searchOrderId.trim()) return;
    
    const order = getOrderById(searchOrderId.toUpperCase());
    if (order) {
      setSelectedOrder(order);
      setViewMode('order');
    } else {
      alert('Order not found. Please check your Order ID and try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStatusTimeline = (order) => {
    const allStatuses = ['confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentStatusIndex = allStatuses.indexOf(order.status);

    return (
      <div style={{ margin: '30px 0' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '25px' }}>Order Timeline</h3>
        
        <div style={{ position: 'relative' }}>
          {allStatuses.map((status, index) => {
            const statusInfo = getOrderStatusInfo(status);
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            return (
              <div key={status} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '25px',
                position: 'relative'
              }}>
                {/* Timeline line */}
                {index < allStatuses.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    left: '25px',
                    top: '50px',
                    width: '2px',
                    height: '30px',
                    backgroundColor: isCompleted ? '#28a745' : '#dee2e6'
                  }} />
                )}
                
                {/* Status circle */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? statusInfo.color : '#dee2e6',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginRight: '20px',
                  border: isCurrent ? '3px solid #ffc107' : 'none',
                  boxShadow: isCurrent ? '0 0 10px rgba(255, 193, 7, 0.5)' : 'none'
                }}>
                  {isCompleted ? statusInfo.icon : index + 1}
                </div>
                
                {/* Status info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 5px 0', 
                    color: isCompleted ? statusInfo.color : '#6c757d',
                    fontSize: '16px'
                  }}>
                    {statusInfo.title}
                  </h4>
                  <p style={{ 
                    margin: '0', 
                    color: '#6c757d', 
                    fontSize: '14px'
                  }}>
                    {statusInfo.description}
                  </p>
                  
                  {/* Show timestamp for completed statuses */}
                  {isCompleted && order.statusHistory.find(h => h.status === status) && (
                    <p style={{ 
                      margin: '5px 0 0 0', 
                      fontSize: '12px', 
                      color: '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {formatDate(order.statusHistory.find(h => h.status === status).timestamp)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderOrderDetails = (order) => (
    <div style={{
      backgroundColor: '#fff',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom: '25px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Order Details</h2>
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: getOrderStatusInfo(order.status).color,
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {getOrderStatusInfo(order.status).title}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        <div>
          <strong>Order ID:</strong>
          <p style={{ margin: '5px 0', color: '#007bff', fontWeight: 'bold' }}>{order.id}</p>
        </div>
        <div>
          <strong>Order Date:</strong>
          <p style={{ margin: '5px 0' }}>{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <strong>Total Amount:</strong>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>₹{order.pricing.total.toFixed(2)}</p>
        </div>
        <div>
          <strong>Payment:</strong>
          <p style={{ margin: '5px 0' }}>Cash on Delivery</p>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '15px' }}>Items ({order.items.length})</h4>
        {order.items.map(item => (
          <div key={item._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '1px solid #eee'
          }}>
            <div>
              <span style={{ fontWeight: 'bold' }}>{item.name}</span>
              <span style={{ color: '#666', marginLeft: '10px' }}>Qty: {item.quantity}</span>
            </div>
            <span style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity * 83).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Delivery Address */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>📍 Delivery Address</h4>
        <p style={{ margin: '0', lineHeight: '1.5' }}>
          <strong>{order.deliveryAddress.fullName}</strong><br />
          {order.deliveryAddress.addressLine1}, {order.deliveryAddress.city}<br />
          {order.deliveryAddress.district}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}<br />
          Phone: {order.deliveryAddress.phone}
        </p>
      </div>
    </div>
  );

  const allOrders = getUserOrders();

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit'
    }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>
        📦 Track Your Order
      </h1>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setViewMode('search')}
          style={{
            backgroundColor: viewMode === 'search' ? '#007bff' : '#f8f9fa',
            color: viewMode === 'search' ? 'white' : '#495057',
            padding: '10px 20px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Track by Order ID
        </button>
        <button
          onClick={() => setViewMode('all-orders')}
          style={{
            backgroundColor: viewMode === 'all-orders' ? '#007bff' : '#f8f9fa',
            color: viewMode === 'all-orders' ? 'white' : '#495057',
            padding: '10px 20px',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          All Orders ({allOrders.length})
        </button>
      </div>

      {/* Search Mode */}
      {viewMode === 'search' && (
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Enter Order ID</h3>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g., SP123456789)"
              style={{
                flex: 1,
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
            />
            <button
              onClick={handleSearchOrder}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px 25px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Track Order
            </button>
          </div>
          
          {allOrders.length > 0 && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '6px' }}>
              <p style={{ margin: '0', fontSize: '14px' }}>
                💡 <strong>Your recent orders:</strong> {allOrders.slice(0, 3).map(order => order.id).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order View */}
      {viewMode === 'order' && selectedOrder && (
        <div>
          <button
            onClick={() => setViewMode('search')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Search
          </button>
          
          {renderOrderDetails(selectedOrder)}
          {renderStatusTimeline(selectedOrder)}
          
          {/* Demo: Update Status Button (for testing) */}
          {selectedOrder.status !== 'delivered' && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => {
                  const nextStatus = {
                    'confirmed': 'preparing',
                    'preparing': 'shipped',
                    'shipped': 'out_for_delivery',
                    'out_for_delivery': 'delivered'
                  };
                  const next = nextStatus[selectedOrder.status];
                  if (next) {
                    updateOrderStatus(selectedOrder.id, next, `Order ${next.replace('_', ' ')}`);
                    setSelectedOrder({...selectedOrder, status: next});
                  }
                }}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Simulate Next Status (Demo)
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Orders View */}
      {viewMode === 'all-orders' && (
        <div>
          {allOrders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
              <h3 style={{ color: '#6c757d' }}>No orders found</h3>
              <p style={{ color: '#6c757d' }}>You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
                Your Orders ({allOrders.length})
              </h3>
              {allOrders.map(order => (
                <div key={order.id} style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '15px',
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setSelectedOrder(order);
                  setViewMode('order');
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                        Order #{order.id}
                      </h4>
                      <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
                        {formatDate(order.createdAt)} • {order.items.length} items • ₹{order.pricing.total.toFixed(2)}
                      </p>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      backgroundColor: getOrderStatusInfo(order.status).color,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {getOrderStatusInfo(order.status).icon} {getOrderStatusInfo(order.status).title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;