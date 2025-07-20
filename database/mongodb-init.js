// MongoDB initialization script for Sandy's Pet Care Solution
// Run this script to set up initial data in MongoDB

// Connect to the database
use petshop;

// Create collections and insert sample data

// Sample products
db.products.insertMany([
  {
    name: "Premium Dog Food",
    description: "High-quality dry dog food for adult dogs",
    price: 45.99,
    category: "dogs",
    brand: "PetNutrition",
    stock: 50,
    image: "/images/dog-food.jpg",
    rating: 4.5,
    numReviews: 125
  },
  {
    name: "Cat Scratching Post",
    description: "Tall scratching post with multiple levels",
    price: 89.99,
    category: "cats",
    brand: "FelineFun",
    stock: 25,
    image: "/images/cat-scratching-post.jpg",
    rating: 4.2,
    numReviews: 78
  },
  {
    name: "Bird Seed Mix",
    description: "Nutritious seed mix for various bird species",
    price: 12.99,
    category: "birds",
    brand: "AviaryBest",
    stock: 100,
    image: "/images/bird-seed.jpg",
    rating: 4.7,
    numReviews: 203
  },
  {
    name: "Fish Tank Filter",
    description: "Advanced filtration system for aquariums",
    price: 65.99,
    category: "fish",
    brand: "AquaClean",
    stock: 30,
    image: "/images/fish-filter.jpg",
    rating: 4.3,
    numReviews: 92
  },
  {
    name: "Hamster Cage",
    description: "Spacious cage with multiple levels and accessories",
    price: 129.99,
    category: "small-animals",
    brand: "SmallPetHome",
    stock: 15,
    image: "/images/hamster-cage.jpg",
    rating: 4.6,
    numReviews: 41
  },
  {
    name: "Reptile Heat Lamp",
    description: "Specialized heating lamp for reptile habitats",
    price: 34.99,
    category: "reptiles",
    brand: "ReptileZone",
    stock: 40,
    image: "/images/reptile-lamp.jpg",
    rating: 4.4,
    numReviews: 67
  }
]);

// Sample admin user (password: admin123)
db.users.insertOne({
  name: "Admin User",
  email: "admin@sandyspetcare.com",
  password: "$2a$10$8K1p/a0dQKnFKYW3nKhJJ.2lGmLdB9ZLEJmzNXvnzJj0xFgSm7kqC",
  role: "admin",
  address: {
    street: "123 Admin Street",
    city: "Admin City",
    state: "Admin State",
    zipCode: "12345",
    country: "USA"
  },
  phone: "+1-555-0123"
});

// Create indexes for better performance
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ createdAt: -1 });

print("Database initialized with sample data!");