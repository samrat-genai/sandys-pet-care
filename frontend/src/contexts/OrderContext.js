import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('sandys-orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders)) {
          setOrders(parsedOrders);
        }
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
      localStorage.removeItem('sandys-orders');
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Saving orders to localStorage:', orders);
      localStorage.setItem('sandys-orders', JSON.stringify(orders));
      console.log('Orders saved successfully');
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
  }, [orders]);

  // Generate order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `SP${timestamp}${random}`;
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      // Prepare order data for backend API
      const backendOrderData = {
        user: '66b1f1a5e5c123456789abcd', // Temporary user ID - should come from authentication
        orderItems: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          product: item.id || '66b1f1a5e5c123456789abce' // Use existing ID or fallback ObjectId
        })),
        shippingAddress: {
          address: orderData.address.addressLine1,
          city: orderData.address.city,
          postalCode: orderData.address.pinCode,
          country: 'India'
        },
        paymentMethod: orderData.paymentMethod,
        taxPrice: 0,
        shippingPrice: orderData.pricing.shipping,
        totalPrice: orderData.pricing.total,
        isPaid: false
      };

      console.log('Sending order to backend:', backendOrderData);

      // Send order to backend API
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendOrderData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const savedOrder = await response.json();
      console.log('Order saved to database:', savedOrder);

      // Create local order object for state management
      const localOrder = {
        id: savedOrder._id,
        ...orderData,
        createdAt: savedOrder.createdAt,
        status: 'confirmed',
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: savedOrder.createdAt,
            message: 'Order confirmed successfully'
          }
        ]
      };

      console.log('Creating local order:', localOrder);
      setOrders(prev => {
        const updatedOrders = [localOrder, ...prev];
        console.log('Updated orders:', updatedOrders);
        return updatedOrders;
      });
      
      return localOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      // Fallback to local storage if API fails
      const orderId = generateOrderId();
      const newOrder = {
        id: orderId,
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            message: 'Order confirmed successfully (stored locally)'
          }
        ]
      };

      console.log('Creating fallback order:', newOrder);
      setOrders(prev => {
        const updatedOrders = [newOrder, ...prev];
        console.log('Updated orders:', updatedOrders);
        return updatedOrders;
      });
      return newOrder;
    }
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus, message) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusHistory: [
            ...order.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              message: message || `Order ${newStatus}`
            }
          ]
        };
      }
      return order;
    }));
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  // Get orders for user (in real app, this would filter by user ID)
  const getUserOrders = () => {
    return orders;
  };

  // Get order status info
  const getOrderStatusInfo = (status) => {
    const statusConfig = {
      confirmed: {
        color: '#007bff',
        icon: '✅',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared.'
      },
      preparing: {
        color: '#ffc107',
        icon: '📦',
        title: 'Preparing Order',
        description: 'We are carefully preparing your pet supplies.'
      },
      shipped: {
        color: '#17a2b8',
        icon: '🚚',
        title: 'Order Shipped',
        description: 'Your order is on its way to your address.'
      },
      out_for_delivery: {
        color: '#fd7e14',
        icon: '🛵',
        title: 'Out for Delivery',
        description: 'Your order is out for delivery and will arrive soon.'
      },
      delivered: {
        color: '#28a745',
        icon: '🎉',
        title: 'Order Delivered',
        description: 'Your order has been delivered successfully.'
      },
      cancelled: {
        color: '#dc3545',
        icon: '❌',
        title: 'Order Cancelled',
        description: 'This order has been cancelled.'
      }
    };

    return statusConfig[status] || statusConfig.confirmed;
  };

  const contextValue = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getUserOrders,
    getOrderStatusInfo
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};