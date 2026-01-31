const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Ensure this matches your actual secret

// class Claims {
//   constructor(userOid, username, password, standardClaims) {
//     this.userOid = userOid;
//     this.username = username;
//     this.password = password;
//     this.standardClaims = standardClaims || {};
//   }
// }

// HashPassword returns the bcrypt hash of the password
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hashedPassword;
  } catch (err) {
    throw new Error(`Failed to hash password: ${err.message}`);
  }
};

// CheckPassword checks if the provided password is correct or not
const checkPassword = async (password, hashedPassword) => {
  try {
   return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error(`Password comparison failed: ${err.message}`);
  }
};

// ParseToken parses and validates the JWT token
const parseToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error(`Failed to parse token: ${err.message}`);
  }
};

module.exports = {
//   Claims,
  hashPassword,
  checkPassword,
  parseToken,
};
