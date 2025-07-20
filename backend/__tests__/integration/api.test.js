const request = require('supertest');
const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

// We'll need to import the app without starting the server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

// Create test app (simplified version of server.js for testing)
const app = express();

// Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/products', require('../../routes/products'));
app.use('/api/orders', require('../../routes/orders'));
app.use('/api/users', require('../../routes/users'));

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something went wrong!' });
});

describe('API Integration Tests', () => {
  describe('Full Order Workflow', () => {
    let createdProduct;
    
    beforeEach(async () => {
      // Create a test product first
      const productData = global.testUtils.createValidProduct();
      createdProduct = new Product(productData);
      await createdProduct.save();
    });

    test('should complete full order workflow: create product -> create order -> update payment', async () => {
      // Step 1: Verify product exists
      const productResponse = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(productResponse.body).toHaveLength(1);
      expect(productResponse.body[0].name).toBe(createdProduct.name);
      
      // Step 2: Create order with the product
      const orderData = global.testUtils.createValidOrder();
      orderData.orderItems[0].product = createdProduct._id;
      
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      expect(orderResponse.body._id).toBeDefined();
      expect(orderResponse.body.isPaid).toBe(false);
      
      const orderId = orderResponse.body._id;
      
      // Step 3: Get the created order
      const getOrderResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);
      
      expect(getOrderResponse.body.totalPrice).toBe(orderData.totalPrice);
      expect(getOrderResponse.body.orderItems[0].product).toBe(createdProduct._id.toString());
      
      // Step 4: Update payment status
      const paymentData = {
        id: 'payment_integration_test',
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: 'integration@test.com'
      };
      
      const paymentResponse = await request(app)
        .put(`/api/orders/${orderId}/pay`)
        .send(paymentData)
        .expect(200);
      
      expect(paymentResponse.body.isPaid).toBe(true);
      expect(paymentResponse.body.paymentResult.id).toBe(paymentData.id);
      
      // Step 5: Verify final order state
      const finalOrderResponse = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);
      
      expect(finalOrderResponse.body.isPaid).toBe(true);
      expect(finalOrderResponse.body.paidAt).toBeDefined();
    });

    test('should handle multiple concurrent orders', async () => {
      const orderPromises = [];
      const numberOfOrders = 5;
      
      // Create multiple orders concurrently
      for (let i = 0; i < numberOfOrders; i++) {
        const orderData = global.testUtils.createValidOrder();
        orderData.orderItems[0].product = createdProduct._id;
        orderData.orderItems[0].name = `Test Product ${i}`;
        
        orderPromises.push(
          request(app)
            .post('/api/orders')
            .send(orderData)
        );
      }
      
      const responses = await Promise.all(orderPromises);
      
      // Verify all orders were created successfully
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body._id).toBeDefined();
        expect(response.body.orderItems[0].name).toBe(`Test Product ${index}`);
      });
      
      // Verify all orders exist in database
      const allOrders = await request(app)
        .get('/api/orders')
        .expect(200);
      
      expect(allOrders.body).toHaveLength(numberOfOrders);
    });

    test('should maintain data consistency across operations', async () => {
      // Create order
      const orderData = global.testUtils.createValidOrder();
      orderData.orderItems[0].product = createdProduct._id;
      
      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      const orderId = createResponse.body._id;
      
      // Multiple simultaneous reads should return same data
      const readPromises = Array(10).fill().map(() =>
        request(app).get(`/api/orders/${orderId}`)
      );
      
      const readResponses = await Promise.all(readPromises);
      
      // All responses should be identical
      const firstResponse = readResponses[0].body;
      readResponses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(firstResponse._id);
        expect(response.body.totalPrice).toBe(firstResponse.totalPrice);
        expect(response.body.isPaid).toBe(firstResponse.isPaid);
      });
    });
  });

  describe('Product-Order Integration', () => {
    test('should link products and orders correctly', async () => {
      // Create multiple products
      const dogProduct = new Product({
        ...global.testUtils.createValidProduct(),
        name: 'Dog Food Premium',
        category: 'dogs',
        price: 29.99
      });
      
      const catProduct = new Product({
        ...global.testUtils.createValidProduct(),
        name: 'Cat Food Deluxe',
        category: 'cats',
        price: 24.99
      });
      
      await dogProduct.save();
      await catProduct.save();
      
      // Create order with both products
      const orderData = global.testUtils.createValidOrder();
      orderData.orderItems = [
        {
          name: dogProduct.name,
          quantity: 2,
          price: dogProduct.price,
          product: dogProduct._id
        },
        {
          name: catProduct.name,
          quantity: 1,
          price: catProduct.price,
          product: catProduct._id
        }
      ];
      
      // Calculate correct total
      const expectedTotal = (dogProduct.price * 2) + (catProduct.price * 1) + orderData.shippingPrice;
      orderData.totalPrice = expectedTotal;
      
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      expect(orderResponse.body.orderItems).toHaveLength(2);
      expect(orderResponse.body.totalPrice).toBe(expectedTotal);
      
      // Verify order items reference correct products
      const savedOrder = await Order.findById(orderResponse.body._id).populate('orderItems.product');
      expect(savedOrder.orderItems[0].product.name).toBe(dogProduct.name);
      expect(savedOrder.orderItems[1].product.name).toBe(catProduct.name);
    });
  });

  describe('Error Handling Integration', () => {
    test('should handle database errors gracefully', async () => {
      // Try to create order with non-existent product
      const orderData = global.testUtils.createValidOrder();
      orderData.orderItems[0].product = new mongoose.Types.ObjectId(); // Non-existent product
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201); // Order creation should still succeed
      
      expect(response.body._id).toBeDefined();
      // Note: The order is created even if product doesn't exist (referential integrity would be handled at business logic level)
    });

    test('should handle malformed requests', async () => {
      const malformedData = {
        invalid: 'data',
        structure: true
      };
      
      const response = await request(app)
        .post('/api/orders')
        .send(malformedData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });
});