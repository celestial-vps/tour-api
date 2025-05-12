// jest.setup.js

// Register module aliases (if using module-alias)
require('module-alias/register');

// Mock middleware that are not needed in unit tests
jest.mock('@middleware/role-guard', () => {
  return jest.fn(() => (req, res, next) => next()); // Correctly mock the role-guard middleware
});

// Mock the validateRequest function correctly
jest.mock('@misc/validation', () => ({
  validateRequest: jest.fn().mockImplementation(() => (req, res, next) => next()) // Mock as Express middleware
}));
