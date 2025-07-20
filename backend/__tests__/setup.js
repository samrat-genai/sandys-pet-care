const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup test database before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Global test utilities
global.testUtils = {
  createValidOrder: () => ({
    user: new mongoose.Types.ObjectId(),
    orderItems: [{
      name: 'Test Product',
      quantity: 2,
      price: 25.99,
      product: new mongoose.Types.ObjectId()
    }],
    shippingAddress: {
      address: 'Test Address 123',
      city: 'Kolkata',
      postalCode: '700001',
      country: 'India'
    },
    paymentMethod: 'cash-on-delivery',
    taxPrice: 0,
    shippingPrice: 40,
    totalPrice: 91.98,
    isPaid: false
  }),
  
  createValidProduct: () => ({
    name: 'Test Dog Food',
    description: 'High quality dog food for testing purposes',
    price: 29.99,
    category: 'dogs',
    brand: 'TestBrand',
    stock: 100,
    rating: 4.5,
    numReviews: 10
  }),
  
  createValidUser: () => ({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!'
  })
};