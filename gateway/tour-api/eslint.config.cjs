module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: { 
      "@typescript-eslint/no-implicit-any": "off",
      'no-unused-vars': 'off', // warn | error | off
      'no-undef': 'off',
      'eqeqeq': 'off',
      'no-console': 'off', 
      
      
      // Tambahkan rules lain sesuai kebutuhan
      
    }
  }
];
