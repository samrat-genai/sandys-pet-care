const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../../../models/Order');
const ordersRouter = require('../../../routes/orders');
const { validationResult } = require('express-validator');

// Mock validation middleware for tests
const mockValidationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Create test app
const app = express();
app.use(express.json());
app.use('/api/orders', ordersRouter);

describe('Orders Routes', () => {
  describe('POST /api/orders', () => {
    test('should create a new order with valid data', async () => {
      const orderData = global.testUtils.createValidOrder();
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      expect(response.body._id).toBeDefined();
      expect(response.body.user).toBe(orderData.user.toString());
      expect(response.body.totalPrice).toBe(orderData.totalPrice);
      expect(response.body.isPaid).toBe(false);
      expect(response.body.isDelivered).toBe(false);
      
      // Verify order was saved to database
      const savedOrder = await Order.findById(response.body._id);
      expect(savedOrder).toBeTruthy();
      expect(savedOrder.totalPrice).toBe(orderData.totalPrice);
    });

    test('should fail with invalid user ID', async () => {
      const orderData = global.testUtils.createValidOrder();
      orderData.user = 'invalid-id';
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(err => err.path === 'user')).toBe(true);
    });

    test('should fail with empty order items', async () => {
      const orderData = global.testUtils.createValidOrder();
      orderData.orderItems = [];
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors.some(err => err.path === 'orderItems')).toBe(true);
    });

    test('should fail with invalid postal code', async () => {
      const orderData = global.testUtils.createValidOrder();
      orderData.shippingAddress.postalCode = '12345'; // Should be 6 digits
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors.some(err => err.path === 'shippingAddress.postalCode')).toBe(true);
    });

    test('should fail with invalid payment method', async () => {
      const orderData = global.testUtils.createValidOrder();
      orderData.paymentMethod = 'invalid-payment';
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors.some(err => err.path === 'paymentMethod')).toBe(true);
    });

    test('should fail with negative prices', async () => {
      const orderData = global.testUtils.createValidOrder();
      orderData.totalPrice = -100;
      orderData.taxPrice = -10;
      orderData.shippingPrice = -5;
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400);
      
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors.some(err => err.path === 'totalPrice')).toBe(true);
    });
  });

  describe('GET /api/orders', () => {
    test('should get all orders', async () => {
      // Create test orders
      const order1 = new Order(global.testUtils.createValidOrder());
      const order2 = new Order(global.testUtils.createValidOrder());
      
      await order1.save();
      await order2.save();
      
      const response = await request(app)
        .get('/api/orders')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    test('should return empty array when no orders exist', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/orders/:id', () => {
    test('should get order by valid ID', async () => {
      const orderData = global.testUtils.createValidOrder();
      const order = new Order(orderData);
      const savedOrder = await order.save();
      
      const response = await request(app)
        .get(`/api/orders/${savedOrder._id}`)
        .expect(200);
      
      expect(response.body._id).toBe(savedOrder._id.toString());
      expect(response.body.totalPrice).toBe(orderData.totalPrice);
    });

    test('should return 404 for non-existent order', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/orders/${nonExistentId}`)
        .expect(404);
      
      expect(response.body.message).toBe('Order not found');
    });

    test('should return 500 for invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id')
        .expect(500);
      
      expect(response.body.message).toBe('Something went wrong!');
    });
  });

  describe('PUT /api/orders/:id/pay', () => {
    test('should update order payment status', async () => {
      const orderData = global.testUtils.createValidOrder();
      const order = new Order(orderData);
      const savedOrder = await order.save();
      
      const paymentData = {
        id: 'payment_123',
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: 'test@example.com'
      };
      
      const response = await request(app)
        .put(`/api/orders/${savedOrder._id}/pay`)
        .send(paymentData)
        .expect(200);
      
      expect(response.body.isPaid).toBe(true);
      expect(response.body.paidAt).toBeDefined();
      expect(response.body.paymentResult.id).toBe(paymentData.id);
      expect(response.body.paymentResult.status).toBe(paymentData.status);
      
      // Verify order was updated in database
      const updatedOrder = await Order.findById(savedOrder._id);
      expect(updatedOrder.isPaid).toBe(true);
      expect(updatedOrder.paidAt).toBeDefined();
    });

    test('should return 404 for non-existent order payment update', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const paymentData = {
        id: 'payment_123',
        status: 'completed'
      };
      
      const response = await request(app)
        .put(`/api/orders/${nonExistentId}/pay`)
        .send(paymentData)
        .expect(404);
      
      expect(response.body.message).toBe('Order not found');
    });
  });
});