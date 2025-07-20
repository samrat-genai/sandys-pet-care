# Contributing to Sandy's Pet Care Solution

Thank you for considering contributing to Sandy's Pet Care Solution project! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Be patient with questions and mistakes
- Maintain professionalism in all interactions

## How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Provide detailed information** including:
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node.js version)

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template**
3. **Provide clear rationale** for why the feature would be beneficial
4. **Include mockups or examples** if applicable

### Submitting Code Changes

#### Before You Start

1. **Fork the repository** and create a new branch
2. **Check existing pull requests** to avoid duplicate work
3. **Discuss major changes** in an issue before implementing

#### Development Setup

1. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/sandys.git
   cd sandys
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start the development servers**:
   ```bash
   # Backend (in one terminal)
   cd backend
   npm run dev
   
   # Frontend (in another terminal)
   cd frontend
   npm start
   ```

#### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the coding standards (see below)
   - Write tests for new functionality
   - Update documentation as needed

3. **Test your changes**:
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a pull request**:
   - Use the pull request template
   - Provide a clear description of the changes
   - Reference any related issues

## Coding Standards

### General Guidelines

- **Use meaningful variable and function names**
- **Write clear, concise comments**
- **Follow the existing code style**
- **Keep functions small and focused**
- **Handle errors appropriately**

### JavaScript/Node.js

- Use ES6+ features when appropriate
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Implement proper error handling

```javascript
// Good
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Bad
const getUserById = (id, callback) => {
  User.findById(id, (err, user) => {
    if (err) {
      callback(err);
    } else {
      callback(null, user);
    }
  });
};
```

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types or TypeScript
- Implement proper error boundaries

```jsx
// Good
const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [product, onAddToCart]);

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

// Bad
class ProductCard extends Component {
  render() {
    return (
      <div className="product-card">
        <h3>{this.props.product.name}</h3>
        <p>${this.props.product.price}</p>
        <button onClick={() => this.props.onAddToCart(this.props.product)}>
          Add to Cart
        </button>
      </div>
    );
  }
}
```

### CSS

- Use CSS custom properties for theming
- Follow BEM methodology for class naming
- Use responsive design principles
- Optimize for performance

```css
/* Good */
.product-card {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
}

.product-card__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.product-card__price {
  color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}

/* Bad */
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
```

## Testing

### Backend Testing

- Write unit tests for all utility functions
- Write integration tests for API endpoints
- Use Jest and Supertest for testing
- Maintain test coverage above 80%

```javascript
// Example test
describe('Product Controller', () => {
  test('should create a new product', async () => {
    const productData = {
      name: 'Test Product',
      price: 19.99,
      category: 'dogs'
    };

    const response = await request(app)
      .post('/api/products')
      .send(productData)
      .expect(201);

    expect(response.body.name).toBe(productData.name);
    expect(response.body.price).toBe(productData.price);
  });
});
```

### Frontend Testing

- Write unit tests for components
- Write integration tests for user flows
- Use React Testing Library
- Test accessibility features

```javascript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

test('should add product to cart when button is clicked', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 19.99
  };
  const mockOnAddToCart = jest.fn();

  render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

  const addButton = screen.getByText('Add to Cart');
  fireEvent.click(addButton);

  expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
});
```

## Documentation

### Code Documentation

- Document all public APIs
- Include JSDoc comments for functions
- Provide examples where helpful

```javascript
/**
 * Creates a new product in the database
 * @param {Object} productData - The product information
 * @param {string} productData.name - The product name
 * @param {number} productData.price - The product price
 * @param {string} productData.category - The product category
 * @returns {Promise<Object>} The created product
 * @throws {Error} If validation fails
 */
const createProduct = async (productData) => {
  // Implementation
};
```

### README Updates

- Update README.md for new features
- Include setup instructions for new dependencies
- Add examples for new functionality

## Commit Messages

Use conventional commit format:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add product search functionality
fix: resolve cart total calculation bug
docs: update API documentation
style: format code with prettier
refactor: extract common utility functions
test: add unit tests for user service
chore: update dependencies
```

## Review Process

### Before Submitting

1. **Run all tests** and ensure they pass
2. **Check code style** with linter
3. **Test manually** in different browsers
4. **Update documentation** if needed
5. **Rebase your branch** if needed

### Pull Request Review

1. **Automated checks** must pass
2. **Code review** by at least one maintainer
3. **Testing** on staging environment
4. **Approval** from project maintainers

### After Merge

1. **Delete feature branch**
2. **Update local main branch**
3. **Close related issues**

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For security-related issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Sandy's Pet Care Solution!