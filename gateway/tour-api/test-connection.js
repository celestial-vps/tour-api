// test-connection.js
const sequelize = require('./config/sequelize');
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  } finally {
    await sequelize.close(); // Tutup koneksi setelah test
  }
})();
