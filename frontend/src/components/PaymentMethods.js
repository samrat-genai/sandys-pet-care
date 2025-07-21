import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PaymentMethods = ({ onSelectPayment, orderAmount }) => {
  const { language } = useLanguage();
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/payments/payment-methods');
      const data = await response.json();
      setPaymentMethods(data.methods);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      setLoading(false);
    }
  };

  /* Future payment integration - keeping for reference
  const initiateRazorpayPayment = async (method) => {
    try {
      // Create order on backend
      const orderResponse = await fetch('http://localhost:5001/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: orderAmount,
          currency: 'INR'
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert('Payment initialization failed');
        return;
      }

      // Razorpay checkout options
      const options = {
        key: 'rzp_test_your_key_id_here', // Replace with actual Razorpay key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Sandy's Pet Care Solution",
        description: 'Pet Supplies Purchase',
        order_id: orderData.order.id,
        handler: async function (response) {
          // Verify payment on backend
          const verifyResponse = await fetch('http://localhost:5001/api/payments/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyResponse.json();
          
          if (verifyData.success) {
            alert('Payment successful! 🎉');
            onSelectPayment(method, response);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Pet Lover',
          email: 'customer@example.com',
          contact: '+919999999999'
        },
        theme: {
          color: '#007bff'
        },
        method: {
          upi: method === 'upi',
          card: method === 'cards',
          netbanking: method === 'netbanking',
          wallet: method === 'wallets'
        }
      };

      // Load Razorpay script dynamically
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  }; */

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading payment methods...</div>;
  }

  if (!paymentMethods) {
    return <div style={{ padding: '20px' }}>Failed to load payment methods</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: language === 'bengali' ? 'Arial, sans-serif' : 'inherit',
      maxWidth: '600px',
      margin: '0 auto' 
    }}>
      <h3>Choose Payment Method</h3>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        
        {/* Cash on Delivery - Only Option */}
        <div 
          onClick={() => onSelectPayment('cod', null)}
          style={{
            border: '2px solid #28a745',
            borderRadius: '8px',
            padding: '20px',
            cursor: 'pointer',
            backgroundColor: '#f8fff9',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '32px' }}>{paymentMethods.cod.icon}</span>
            <div>
              <strong style={{ fontSize: '18px', color: '#28a745' }}>{paymentMethods.cod.name}</strong>
              <p style={{ margin: '8px 0', color: '#666', fontSize: '14px' }}>
                {paymentMethods.cod.description}
              </p>
              <p style={{ margin: '8px 0', color: '#28a745', fontSize: '13px', fontWeight: 'bold' }}>
                {paymentMethods.cod.note}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentMethods;