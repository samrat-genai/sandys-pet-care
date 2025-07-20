# API Documentation

This document provides detailed information about Sandy's Pet Care Solution API endpoints.

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Products

#### GET /products
Get all products

**Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "category": "string",
    "brand": "string",
    "stock": "number",
    "image": "string",
    "rating": "number",
    "numReviews": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### GET /products/:id
Get a specific product by ID

**Parameters:**
- `id` (string): Product ID

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "brand": "string",
  "stock": "number",
  "image": "string",
  "rating": "number",
  "numReviews": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### POST /products
Create a new product (Admin only)

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "brand": "string",
  "stock": "number",
  "image": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "brand": "string",
  "stock": "number",
  "image": "string",
  "rating": 0,
  "numReviews": 0,
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### PUT /products/:id
Update a product (Admin only)

**Parameters:**
- `id` (string): Product ID

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "brand": "string",
  "stock": "number",
  "image": "string"
}
```

#### DELETE /products/:id
Delete a product (Admin only)

**Parameters:**
- `id` (string): Product ID

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### Users

#### POST /users/register
Register a new user

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

#### POST /users/login
User login

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "token": "string"
}
```

#### GET /users/profile
Get user profile (Protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "phone": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Orders

#### POST /orders
Create a new order

**Request Body:**
```json
{
  "user": "string",
  "orderItems": [
    {
      "name": "string",
      "quantity": "number",
      "price": "number",
      "product": "string"
    }
  ],
  "shippingAddress": {
    "address": "string",
    "city": "string",
    "postalCode": "string",
    "country": "string"
  },
  "paymentMethod": "string",
  "taxPrice": "number",
  "shippingPrice": "number",
  "totalPrice": "number"
}
```

**Response:**
```json
{
  "_id": "string",
  "user": "string",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "string",
  "taxPrice": "number",
  "shippingPrice": "number",
  "totalPrice": "number",
  "isPaid": false,
  "isDelivered": false,
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### GET /orders
Get all orders (Admin only)

**Response:**
```json
[
  {
    "_id": "string",
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "orderItems": [...],
    "shippingAddress": {...},
    "paymentMethod": "string",
    "taxPrice": "number",
    "shippingPrice": "number",
    "totalPrice": "number",
    "isPaid": "boolean",
    "isDelivered": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

#### GET /orders/:id
Get order by ID

**Parameters:**
- `id` (string): Order ID

**Response:**
```json
{
  "_id": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string"
  },
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "string",
  "taxPrice": "number",
  "shippingPrice": "number",
  "totalPrice": "number",
  "isPaid": "boolean",
  "isDelivered": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### PUT /orders/:id/pay
Update order payment status

**Parameters:**
- `id` (string): Order ID

**Request Body:**
```json
{
  "id": "string",
  "status": "string",
  "update_time": "string",
  "email_address": "string"
}
```

**Response:**
```json
{
  "_id": "string",
  "isPaid": true,
  "paidAt": "date",
  "paymentResult": {
    "id": "string",
    "status": "string",
    "update_time": "string",
    "email_address": "string"
  }
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Exceeded requests return `429 Too Many Requests`