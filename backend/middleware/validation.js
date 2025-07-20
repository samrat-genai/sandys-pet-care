const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Order validation rules
const validateOrder = [
  body('user')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order items must be an array with at least one item'),
  
  body('orderItems.*.name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),
  
  body('orderItems.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
  
  body('orderItems.*.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('orderItems.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('shippingAddress.address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters'),
  
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('shippingAddress.postalCode')
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Postal code must be a 6-digit number'),
  
  body('shippingAddress.country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  
  body('paymentMethod')
    .isIn(['credit-card', 'paypal', 'stripe', 'cash-on-delivery', 'cod'])
    .withMessage('Invalid payment method'),
  
  body('taxPrice')
    .isFloat({ min: 0 })
    .withMessage('Tax price must be a positive number'),
  
  body('shippingPrice')
    .isFloat({ min: 0 })
    .withMessage('Shipping price must be a positive number'),
  
  body('totalPrice')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
  
  handleValidationErrors
];

// Product validation rules
const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  
  body('category')
    .isIn(['dogs', 'cats', 'birds', 'fish', 'small-animals', 'reptiles'])
    .withMessage('Invalid category'),
  
  body('brand')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('numReviews')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of reviews must be a non-negative integer'),
  
  handleValidationErrors
];

// User validation rules
const validateUser = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  
  handleValidationErrors
];

module.exports = {
  validateOrder,
  validateProduct,
  validateUser,
  handleValidationErrors
};