import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const DeliveryAddress = ({ onAddressSubmit, onBack }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: 'West Bengal',
    pinCode: '',
    landmark: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const westBengalDistricts = [
    'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Hooghly',
    'Bardhaman', 'Nadia', 'Murshidabad', 'Birbhum', 'Paschim Medinipur',
    'Purba Medinipur', 'Bankura', 'Purulia', 'Malda', 'South Dinajpur',
    'North Dinajpur', 'Jalpaiguri', 'Darjeeling', 'Cooch Behar', 'Alipurduar',
    'Kalimpong', 'Jhargram'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.district) {
      newErrors.district = 'District is required';
    }

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit pin code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onAddressSubmit(formData);
      setIsSubmitting(false);
    }, 500);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit',
    transition: 'border-color 0.3s ease'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#dc3545'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '14px'
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit'
    }}>
      <h2 style={{ 
        color: '#2c3e50', 
        marginBottom: '30px',
        textAlign: 'center' 
      }}>
        Delivery Address
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: '20px' }}>
          
          {/* Full Name */}
          <div>
            <label style={labelStyle} htmlFor="fullName">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              style={errors.fullName ? errorInputStyle : inputStyle}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Phone and Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle} htmlFor="phone">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={errors.phone ? errorInputStyle : inputStyle}
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phone && (
                <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.phone}
                </span>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="email">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={errors.email ? errorInputStyle : inputStyle}
                placeholder="your@email.com"
              />
              {errors.email && (
                <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Address Line 1 */}
          <div>
            <label style={labelStyle} htmlFor="addressLine1">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleInputChange}
              style={errors.addressLine1 ? errorInputStyle : inputStyle}
              placeholder="House/Flat No, Building Name, Street"
            />
            {errors.addressLine1 && (
              <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                {errors.addressLine1}
              </span>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label style={labelStyle} htmlFor="addressLine2">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Area, Locality"
            />
          </div>

          {/* City and District */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle} htmlFor="city">
                City/Town *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={errors.city ? errorInputStyle : inputStyle}
                placeholder="City/Town"
              />
              {errors.city && (
                <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.city}
                </span>
              )}
            </div>

            <div>
              <label style={labelStyle} htmlFor="district">
                District *
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                style={errors.district ? errorInputStyle : inputStyle}
              >
                <option value="">Select District</option>
                {westBengalDistricts.map(district => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.district}
                </span>
              )}
            </div>
          </div>

          {/* State and Pin Code */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle} htmlFor="state">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                readOnly
                style={{ ...inputStyle, backgroundColor: '#f8f9fa', color: '#6c757d' }}
              />
            </div>

            <div>
              <label style={labelStyle} htmlFor="pinCode">
                Pin Code *
              </label>
              <input
                type="text"
                id="pinCode"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                style={errors.pinCode ? errorInputStyle : inputStyle}
                placeholder="700001"
                maxLength="6"
              />
              {errors.pinCode && (
                <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  {errors.pinCode}
                </span>
              )}
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label style={labelStyle} htmlFor="landmark">
              Landmark (Optional)
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Near school, hospital, etc."
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '15px 25px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                flex: '0 0 auto'
              }}
            >
              ← Back to Cart
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                color: 'white',
                padding: '15px 25px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: isSubmitting ? 'default' : 'pointer',
                flex: 1
              }}
            >
              {isSubmitting ? 'Saving...' : 'Continue to Payment →'}
            </button>
          </div>
        </div>
      </form>

      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <strong>📍 Delivery Information:</strong>
        <p style={{ margin: '5px 0' }}>
          • Free delivery within West Bengal for orders above ₹999
        </p>
        <p style={{ margin: '5px 0' }}>
          • Delivery time: 1-3 days within West Bengal
        </p>
        <p style={{ margin: '5px 0' }}>
          • Cash on Delivery available
        </p>
      </div>
    </div>
  );
};

export default DeliveryAddress;