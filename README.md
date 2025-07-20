# 🐾 Sandy's Pet Care Solution

[![Security](https://img.shields.io/badge/Security-Hardened-green.svg)](./SECURITY.md)
[![Tests](https://img.shields.io/badge/Tests-Comprehensive-brightgreen.svg)](./TESTING.md)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](./LICENSE)

A secure, fully-tested e-commerce platform for pet supplies built with modern web technologies.

## ✨ Features

### 🛒 Core Functionality
- **Product Catalog**: Browse by categories (Dogs, Cats, Birds, Fish, Small Animals, Reptiles)
- **Shopping Cart**: Add/remove items with real-time price calculation
- **Order Processing**: Complete order workflow with payment tracking
- **Multi-language Support**: Bengali and English support

### 🔒 Security Features
- **Input Validation**: Comprehensive validation using express-validator
- **NoSQL Injection Protection**: MongoDB sanitization middleware
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js with Content Security Policy
- **Environment Variables**: Secure configuration management
- **CORS Protection**: Controlled cross-origin requests

### 🧪 Testing & Quality
- **Unit Tests**: Models, routes, and components
- **Integration Tests**: End-to-end workflow testing
- **Load Testing**: Performance and concurrency validation
- **Code Coverage**: Comprehensive test coverage
- **Automated Testing**: Jest and React Testing Library

### 🎨 User Experience
- **Responsive Design**: Works on all device sizes
- **Category Navigation**: Easy browsing with visual categories
- **Order Tracking**: Real-time order status updates
- **Form Validation**: Indian postal codes and address validation

## 📁 Project Structure

```
sandys/
├── 📱 frontend/                    # React application
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── contexts/              # React contexts
│   │   ├── translations/          # Language support
│   │   └── __tests__/            # Frontend tests
│   ├── public/
│   └── package.json
├── 🔧 backend/                     # Node.js API server
│   ├── models/                   # Mongoose schemas
│   ├── routes/                   # Express routes
│   ├── middleware/               # Security & validation
│   ├── __tests__/               # Backend tests
│   │   ├── unit/                # Unit tests
│   │   ├── integration/         # Integration tests
│   │   └── load/                # Load tests
│   ├── .env.example             # Environment template
│   └── server.js
├── 🗄️ database/                    # Database setup
│   ├── mongodb-init.js
│   ├── docker-compose.yml
│   └── init.sql
├── 🎨 assets/                      # Static assets
│   ├── css/, js/, images/
│   └── fonts/
├── 📚 documentation/               # Project docs
├── 🔒 SECURITY.md                 # Security documentation
├── 🧪 TESTING.md                  # Testing documentation
└── .gitignore                    # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MongoDB** ([Install](https://docs.mongodb.com/manual/installation/)) or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** ([Download](https://git-scm.com/downloads))

### ⚡ Fast Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sandys-pet-care.git
cd sandys-pet-care

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# 3. Frontend setup
cd ../frontend
npm install

# 4. Start development servers
cd ../backend && npm run dev &    # Backend on :5001
cd ../frontend && npm start &     # Frontend on :3000
```

### 🔧 Environment Configuration

Create `backend/.env` with:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/petshop
JWT_SECRET=your_secure_random_string_here
FRONTEND_URL=http://localhost:3000
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order payment status

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/petshop
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

## 🧪 Testing & Development

### Running Tests

```bash
# Backend tests
cd backend
npm test                 # All tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:coverage    # Coverage report
npm run test:load        # Load testing

# Frontend tests
cd frontend
npm test                 # Interactive test runner
```

### 📊 Test Coverage

- **Unit Tests**: Models, routes, components
- **Integration Tests**: Full workflow testing
- **Load Tests**: Performance validation
- **Security Tests**: Input validation, injection protection

### 🔧 Development Scripts

```bash
# Backend
npm run dev              # Development server with nodemon
npm run start            # Production server
npm test                 # Run all tests

# Frontend  
npm start                # Development server
npm run build            # Production build
npm test                 # Test runner
```

## 🛡️ Security Features

- **✅ Input Validation**: Express-validator with comprehensive rules
- **✅ NoSQL Injection Protection**: MongoDB sanitization
- **✅ Rate Limiting**: Configurable request throttling
- **✅ Security Headers**: Helmet.js with CSP
- **✅ CORS Protection**: Controlled cross-origin access
- **✅ Environment Security**: Secure configuration management

> 📖 Read [SECURITY.md](./SECURITY.md) for detailed security documentation

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing  
- **React Context** - State management
- **CSS3** - Styling with custom properties

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Helmet** - Security middleware
- **Express-validator** - Input validation

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP testing
- **React Testing Library** - Component testing
- **MongoDB Memory Server** - Test database

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** your changes (`npm test`)
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### 📋 Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow security best practices

## 📸 Screenshots

### Home Page with Category Navigation
![Home Page](./assets/images/screenshot-home.png)

### Product Catalog with Filtering
![Products](./assets/images/screenshot-products.png)

### Secure Order Process
![Order](./assets/images/screenshot-order.png)

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure production MongoDB URI
- [ ] Set up HTTPS certificates
- [ ] Configure production CORS origins
- [ ] Enable production logging
- [ ] Set up monitoring

### Recommended Hosting

- **Frontend**: [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)
- **Backend**: [Railway](https://railway.app/) / [Render](https://render.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Documentation

- 📖 **[Security Documentation](./SECURITY.md)** - Security features and guidelines
- 🧪 **[Testing Documentation](./TESTING.md)** - Testing setup and coverage
- 🐛 **[Issues](https://github.com/your-username/sandys-pet-care/issues)** - Bug reports and feature requests
- 💬 **[Discussions](https://github.com/your-username/sandys-pet-care/discussions)** - Community discussions

---

**Built with ❤️ for pet lovers everywhere** 🐾

**Developed by**: Sandy's Pet Care Development Team  
**Version**: 1.0.0  
**Status**: Production Ready ✅