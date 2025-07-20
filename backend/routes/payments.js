const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (you'll need to add these to .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
});

// Create order for Razorpay
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
      .update(sign.toString())
      .digest('hex');
    
    if (razorpay_signature === expectedSign) {
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// UPI payment options popular in India
router.get('/payment-methods', (req, res) => {
  res.json({
    success: true,
    methods: {
      upi: {
        name: 'UPI',
        description: 'Pay using any UPI app (Google Pay, PhonePe, Paytm, etc.)',
        icon: '📱',
        available: true
      },
      netbanking: {
        name: 'Net Banking',
        description: 'Pay using your bank account',
        icon: '🏦',
        available: true,
        banks: [
          'State Bank of India',
          'HDFC Bank',
          'ICICI Bank',
          'Axis Bank',
          'Punjab National Bank',
          'Bank of Baroda',
          'Canara Bank',
          'Union Bank of India'
        ]
      },
      cards: {
        name: 'Debit/Credit Cards',
        description: 'Visa, Mastercard, RuPay',
        icon: '💳',
        available: true
      },
      wallets: {
        name: 'Digital Wallets',
        description: 'Paytm, PhonePe, Amazon Pay',
        icon: '💰',
        available: true
      },
      cod: {
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: '🚚',
        available: true,
        note: 'Available for orders within West Bengal'
      }
    }
  });
});

module.exports = router;