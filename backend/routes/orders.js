const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { validateOrder } = require('../middleware/validation');

// Create new order
router.post('/', validateOrder, async (req, res) => {
  try {
    console.log('Received order data:', JSON.stringify(req.body, null, 2));
    const order = new Order(req.body);
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    console.error('Error details:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

// Update order to paid
router.put('/:id/pay', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;