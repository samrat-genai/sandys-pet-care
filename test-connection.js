// Simple test to verify backend connectivity
const https = require('http');

const testBackend = () => {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/products',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Backend Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const products = JSON.parse(data);
        console.log(`Found ${products.length} products`);
        console.log('Backend is working correctly!');
      } catch (error) {
        console.log('Backend response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Backend connection error:', error.message);
  });

  req.end();
};

console.log('Testing backend connection...');
testBackend();