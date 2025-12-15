export default () => ({
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT || '3306', 10),
  dbUsername: process.env.DB_USERNAME || 'root',
  dbPassword: process.env.DB_PASSWORD || 'Serverh5n&*#',
  dbName: process.env.DB_NAME || 'newsdb',
});
