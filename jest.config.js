module.exports = {
    roots: ['<rootDir>/__tests__'],
    moduleDirectories: ['node_modules', '<rootDir>'], // Ensure Jest can resolve from root directory
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
        'repositories/**/*.js',
        "services/**/*.js",
        '!**/node_modules/**',
        '!**/__tests__/**',
        '!**/tests/**',
        '!**/coverage/**',
    ],
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/tests/**/*.test.js',
        '**/?(*.)+(spec|test).js'
    ],
    moduleFileExtensions: ['js', 'json'],
    resetMocks: true,
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@middleware/(.*)$': '<rootDir>/middleware/$1',
        '^@misc/(.*)$': '<rootDir>/misc/$1',
        '^@models/(.*)$': '<rootDir>/models/$1',  // ✅ Add this line
    }
};
