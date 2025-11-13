# Contributing to CSPM API

Thank you for your interest in contributing to the CSPM API project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what is best for the community
- Show empathy towards others

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB v6 or higher
- Git
- Code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/CSPM-API.git
   cd CSPM-API
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/anupyadav27/CSPM-API.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch (if used)
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes

### Creating a Feature Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** in the appropriate files
2. **Test your changes** thoroughly
3. **Run linting and formatting**
   ```bash
   npm run lint
   npm run format
   ```
4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add SAML authentication support
fix(api): resolve pagination bug in asset endpoint
docs: update API documentation for compliance endpoints
refactor(services): improve error handling in asset service
```

## Coding Standards

### JavaScript Style Guide

We use ESLint and Prettier for code consistency. The configuration is already set up in the project.

**Key guidelines:**
- Use ES6+ features (const, let, arrow functions, destructuring)
- Use async/await instead of promises when possible
- No var declarations
- Use strict equality (===)
- Prefer const over let when values don't change
- Use meaningful variable and function names

### Code Organization

```javascript
// 1. Imports - external libraries first
import express from "express";
import mongoose from "mongoose";

// 2. Imports - internal modules
import User from "../models/user.js";
import authServices from "../services/authServices.js";

// 3. Constants
const PORT = 5000;

// 4. Function definitions
export const createUser = async (req, res) => {
    // Implementation
};
```

### Error Handling

Always use try-catch blocks for async operations:

```javascript
export const getAssets = async (req, res) => {
    try {
        const assets = await assetServices.getAllAssets();
        res.status(200).json({ success: true, data: assets });
    } catch (error) {
        console.error("Error in getAssets:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch assets" 
        });
    }
};
```

### Security Best Practices

- Never commit sensitive data (credentials, tokens, etc.)
- Use environment variables for configuration
- Validate all input data
- Use parameterized queries to prevent injection attacks
- Hash passwords with bcryptjs
- Implement proper authentication and authorization
- Log security-relevant events

### Database Operations

**Use transactions for multi-document operations:**

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
    await User.create([userData], { session });
    await AuditLog.create([logData], { session });
    await session.commitTransaction();
} catch (error) {
    await session.abortTransaction();
    throw error;
} finally {
    await session.endSession();
}
```

**Add indexes for frequently queried fields:**

```javascript
AssetSchema.index({ tenantId: 1, resourceType: 1 });
AssetSchema.index({ region: 1, environment: 1 });
```

### API Design

**Controller structure:**

```javascript
export const getResourceController = async (req, res) => {
    try {
        // 1. Extract and validate parameters
        const { id } = req.params;
        const filters = { /* from query params */ };
        
        // 2. Call service layer
        const result = await resourceService.getResource(id, filters);
        
        // 3. Format response
        res.status(200).json({
            success: true,
            message: "Resource fetched successfully",
            data: result
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
```

**Service structure:**

```javascript
const resourceService = () => {
    const getResource = async (id, filters) => {
        // Business logic here
        const resource = await Resource.findById(id);
        if (!resource) {
            throw new Error("Resource not found");
        }
        return resource;
    };
    
    return { getResource };
};

export default resourceService;
```

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

Currently, the project doesn't have a comprehensive test suite. Contributions to add tests are welcome!

**Test structure (when implemented):**

```javascript
describe("Asset Controller", () => {
    it("should return assets with pagination", async () => {
        // Test implementation
    });
    
    it("should filter assets by environment", async () => {
        // Test implementation
    });
});
```

## Documentation

### Code Documentation

Use JSDoc comments for functions:

```javascript
/**
 * Creates a new asset in the database
 * @param {Object} assetData - Asset information
 * @param {string} assetData.name - Asset name
 * @param {string} assetData.resourceId - Cloud resource ID
 * @returns {Promise<Object>} Created asset object
 * @throws {Error} If asset creation fails
 */
const createAsset = async (assetData) => {
    // Implementation
};
```

### API Documentation

When adding new endpoints:
1. Update `API_DOCUMENTATION.md` with endpoint details
2. Include request/response examples
3. Document query parameters and filters
4. Add cURL examples

### README Updates

Update `README.md` if you:
- Add new features
- Change architecture
- Modify setup process
- Add new dependencies

## Pull Request Process

### Before Submitting

1. **Ensure your code follows the style guide**
   ```bash
   npm run lint
   npm run format
   ```

2. **Test your changes locally**
   ```bash
   npm run dev
   # Test endpoints manually or with automated tests
   ```

3. **Update documentation** if needed

4. **Commit changes with meaningful messages**

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting a Pull Request

1. **Go to GitHub** and create a pull request from your fork

2. **Fill in the PR template** with:
   - Description of changes
   - Related issue numbers (if any)
   - Testing performed
   - Screenshots (for UI changes)

3. **Request review** from maintainers

4. **Address feedback** promptly and professionally

### PR Review Process

- Maintainers will review your PR
- Automated checks (linting, tests) must pass
- At least one approval is required
- Changes may be requested
- Once approved, maintainers will merge

### After Your PR is Merged

1. **Update your local repository**
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Delete your feature branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Verify the issue** with latest code

### Creating a Good Issue

**For bugs:**
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, OS, etc.)
- Error messages and stack traces
- Screenshots if applicable

**For features:**
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Alternatives considered

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `security` - Security-related issues

## Project Structure Guidelines

### Adding New Features

When adding new features:

1. **Create model** in `src/models/` if needed
2. **Create service** in `src/services/` for business logic
3. **Create controller** in `src/controllers/` for request handling
4. **Create routes** in `src/routes/` for API endpoints
5. **Update `app.js`** to include new routes
6. **Add tests** (when test infrastructure exists)
7. **Update documentation**

### File Naming Conventions

- Use camelCase for file names: `userController.js`
- Use PascalCase for model files: `User.js` (if exporting class)
- Use descriptive names: `authMiddleware.js`, not `auth.js`

## Getting Help

If you need help:
- Check existing documentation
- Search closed issues
- Ask in issue discussions
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Thank You!

Your contributions help make CSPM API better for everyone. We appreciate your time and effort!
