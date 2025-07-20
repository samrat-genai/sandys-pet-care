-- Sandy's Pet Care Solution Database Schema
-- This file contains SQL commands to initialize the database structure

-- Create database (if using PostgreSQL)
-- CREATE DATABASE petshop;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip VARCHAR(20),
    address_country VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    stock INTEGER DEFAULT 0,
    image VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_price DECIMAL(10, 2) NOT NULL,
    tax_price DECIMAL(10, 2) DEFAULT 0,
    shipping_price DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    shipping_address_street VARCHAR(255),
    shipping_address_city VARCHAR(100),
    shipping_address_postal_code VARCHAR(20),
    shipping_address_country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    name VARCHAR(255),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping cart table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Dogs', 'Products for dogs including food, toys, and accessories'),
('Cats', 'Products for cats including food, toys, and accessories'),
('Birds', 'Products for birds including food, cages, and accessories'),
('Fish', 'Products for fish including food, tanks, and accessories'),
('Small Animals', 'Products for small animals like hamsters, rabbits, and guinea pigs'),
('Reptiles', 'Products for reptiles including food, habitats, and accessories');

-- Insert sample products
INSERT INTO products (name, description, price, category, brand, stock, rating, num_reviews) VALUES
('Premium Dog Food', 'High-quality dry dog food for adult dogs', 45.99, 'dogs', 'PetNutrition', 50, 4.5, 125),
('Cat Scratching Post', 'Tall scratching post with multiple levels', 89.99, 'cats', 'FelineFun', 25, 4.2, 78),
('Bird Seed Mix', 'Nutritious seed mix for various bird species', 12.99, 'birds', 'AviaryBest', 100, 4.7, 203),
('Fish Tank Filter', 'Advanced filtration system for aquariums', 65.99, 'fish', 'AquaClean', 30, 4.3, 92),
('Hamster Cage', 'Spacious cage with multiple levels and accessories', 129.99, 'small-animals', 'SmallPetHome', 15, 4.6, 41),
('Reptile Heat Lamp', 'Specialized heating lamp for reptile habitats', 34.99, 'reptiles', 'ReptileZone', 40, 4.4, 67);