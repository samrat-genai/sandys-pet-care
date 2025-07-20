const mongoose = require('mongoose');
const Product = require('../../../models/Product');

describe('Product Model', () => {
  describe('Schema Validation', () => {
    test('should create a valid product', async () => {
      const productData = global.testUtils.createValidProduct();
      const product = new Product(productData);
      
      const savedProduct = await product.save();
      
      expect(savedProduct._id).toBeDefined();
      expect(savedProduct.name).toBe(productData.name);
      expect(savedProduct.description).toBe(productData.description);
      expect(savedProduct.price).toBe(productData.price);
      expect(savedProduct.category).toBe(productData.category);
      expect(savedProduct.brand).toBe(productData.brand);
      expect(savedProduct.stock).toBe(productData.stock);
      expect(savedProduct.rating).toBe(productData.rating);
      expect(savedProduct.numReviews).toBe(productData.numReviews);
      expect(savedProduct.createdAt).toBeDefined();
      expect(savedProduct.updatedAt).toBeDefined();
    });

    test('should fail validation with missing required fields', async () => {
      const product = new Product({});
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.name).toBeDefined();
      expect(error.errors.description).toBeDefined();
      expect(error.errors.price).toBeDefined();
      expect(error.errors.category).toBeDefined();
      expect(error.errors.brand).toBeDefined();
      expect(error.errors.stock).toBeDefined();
    });

    test('should fail validation with invalid category', async () => {
      const productData = global.testUtils.createValidProduct();
      productData.category = 'invalid-category';
      
      const product = new Product(productData);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.category).toBeDefined();
    });

    test('should fail validation with negative price', async () => {
      const productData = global.testUtils.createValidProduct();
      productData.price = -10;
      
      const product = new Product(productData);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.price).toBeDefined();
    });

    test('should fail validation with negative stock', async () => {
      const productData = global.testUtils.createValidProduct();
      productData.stock = -5;
      
      const product = new Product(productData);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.stock).toBeDefined();
    });

    test('should fail validation with rating out of range', async () => {
      const productData = global.testUtils.createValidProduct();
      productData.rating = 6; // Rating should be max 5
      
      const product = new Product(productData);
      
      let error;
      try {
        await product.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.rating).toBeDefined();
    });

    test('should set default values correctly', async () => {
      const productData = global.testUtils.createValidProduct();
      delete productData.rating;
      delete productData.numReviews;
      delete productData.image;
      
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      expect(savedProduct.rating).toBe(0);
      expect(savedProduct.numReviews).toBe(0);
      expect(savedProduct.image).toBe('');
    });

    test('should trim whitespace from name and brand', async () => {
      const productData = global.testUtils.createValidProduct();
      productData.name = '  Test Product  ';
      productData.brand = '  Test Brand  ';
      
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      expect(savedProduct.name).toBe('Test Product');
      expect(savedProduct.brand).toBe('Test Brand');
    });
  });

  describe('Product Operations', () => {
    test('should update product stock', async () => {
      const productData = global.testUtils.createValidProduct();
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      savedProduct.stock = 50;
      const updatedProduct = await savedProduct.save();
      
      expect(updatedProduct.stock).toBe(50);
    });

    test('should update product rating and reviews', async () => {
      const productData = global.testUtils.createValidProduct();
      const product = new Product(productData);
      const savedProduct = await product.save();
      
      savedProduct.rating = 4.8;
      savedProduct.numReviews = 25;
      const updatedProduct = await savedProduct.save();
      
      expect(updatedProduct.rating).toBe(4.8);
      expect(updatedProduct.numReviews).toBe(25);
    });

    test('should find products by category', async () => {
      const dogProduct = new Product({
        ...global.testUtils.createValidProduct(),
        name: 'Dog Food',
        category: 'dogs'
      });
      
      const catProduct = new Product({
        ...global.testUtils.createValidProduct(),
        name: 'Cat Food',
        category: 'cats'
      });
      
      await dogProduct.save();
      await catProduct.save();
      
      const dogProducts = await Product.find({ category: 'dogs' });
      const catProducts = await Product.find({ category: 'cats' });
      
      expect(dogProducts).toHaveLength(1);
      expect(catProducts).toHaveLength(1);
      expect(dogProducts[0].name).toBe('Dog Food');
      expect(catProducts[0].name).toBe('Cat Food');
    });
  });
});