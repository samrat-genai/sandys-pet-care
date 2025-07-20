const mongoose = require('mongoose');

const shippingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['local', 'state', 'national'],
    required: true
  },
  areas: [{
    type: String,
    required: true
  }],
  baseRate: {
    type: Number,
    required: true
  },
  perKgRate: {
    type: Number,
    required: true
  },
  freeShippingThreshold: {
    type: Number,
    default: 0
  },
  estimatedDays: {
    min: Number,
    max: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingZone', shippingZoneSchema);