const express = require('express');
const router = express.Router();
const ShippingZone = require('../models/Shipping');

// Get all shipping zones
router.get('/', async (req, res) => {
  try {
    const zones = await ShippingZone.find({});
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate shipping cost
router.post('/calculate', async (req, res) => {
  try {
    const { pincode, weight, orderValue } = req.body;
    
    // Simple pincode to zone mapping for West Bengal
    let zoneType = 'national';
    if (pincode.startsWith('70') || pincode.startsWith('71') || pincode.startsWith('72') || pincode.startsWith('73')) {
      zoneType = 'local'; // West Bengal
    }
    
    const zone = await ShippingZone.findOne({ type: zoneType });
    if (!zone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }
    
    let shippingCost = zone.baseRate + (weight * zone.perKgRate);
    
    // Free shipping check
    if (orderValue >= zone.freeShippingThreshold) {
      shippingCost = 0;
    }
    
    res.json({
      zone: zone.name,
      cost: shippingCost,
      estimatedDays: zone.estimatedDays,
      freeShipping: orderValue >= zone.freeShippingThreshold
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;