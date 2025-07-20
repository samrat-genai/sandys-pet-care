// Common JavaScript utilities for Sandy's Pet Care Solution

// API base URL
const API_BASE_URL = 'http://localhost:5001/api';

// Utility functions
const Utils = {
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  },

  // Format date
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Show notification
  showNotification: (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  },

  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Local storage helpers
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  }
};

// API service
const API = {
  // Generic request method
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      Utils.showNotification(error.message, 'error');
      throw error;
    }
  },

  // Products
  getProducts: () => API.request('/products'),
  getProduct: (id) => API.request(`/products/${id}`),
  
  // Users
  login: (credentials) => API.request('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => API.request('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  // Orders
  createOrder: (orderData) => API.request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  
  getOrder: (id) => API.request(`/orders/${id}`)
};

// Shopping cart functionality
const Cart = {
  items: Utils.getItem('cart') || [],

  add: (product, quantity = 1) => {
    const existingItem = Cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      Cart.items.push({ ...product, quantity });
    }
    
    Cart.save();
    Utils.showNotification(`${product.name} added to cart`, 'success');
  },

  remove: (productId) => {
    Cart.items = Cart.items.filter(item => item.id !== productId);
    Cart.save();
    Utils.showNotification('Item removed from cart', 'info');
  },

  updateQuantity: (productId, quantity) => {
    const item = Cart.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      Cart.save();
    }
  },

  getTotal: () => {
    return Cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getItemCount: () => {
    return Cart.items.reduce((count, item) => count + item.quantity, 0);
  },

  clear: () => {
    Cart.items = [];
    Cart.save();
  },

  save: () => {
    Utils.setItem('cart', Cart.items);
  }
};

// Initialize cart from local storage
Cart.items = Utils.getItem('cart') || [];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils, API, Cart };
}