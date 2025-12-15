require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECREATKEY || 'celestial-super-secret-key-should-be-longer-123!'; // Replace with your secret key

class JwtMaker {
  constructor() {
    this.secretKey = SECRET_KEY;
  }

  createToken(oid, emailName,role) {
    const payload = {
      userOid: oid,
      username: emailName,
      level: 'application',
      role:role,
      exp: Math.floor(Date.now() / 1000) + (72 * 60 * 60) // 72 hours expiration
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretKey, { algorithm: 'HS256' }, (error, token) => {
        if (error) return reject(error);
        resolve(token);
      });
    });
  }

  verifyToken(accessToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, this.secretKey, (error, decoded) => {
        if (error) return reject(error);
        resolve(decoded);
      });
    });
  }

  // getClaims(tokenString) {
  //   return new Promise((resolve, reject) => {
  //     jwt.decode(tokenString, { complete: true }, (error, decoded) => {
  //       if (error) return reject(error);
  //       resolve(decoded ? decoded.payload : {});
  //     });
  //   });
  // }
  async getClaims(tokenString) {
    const decoded = jwt.decode(tokenString, { complete: true });
    return decoded ? decoded.payload : null;
  }

  getClaimsByOid(tokenString) {
    return this.getClaims(tokenString);
  }
}

// Express middleware for verifying token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized

  try {
    const jwtMaker = new JwtMaker();
    const user = await jwtMaker.verifyToken(token);
    req.user = user; // Attach user info to the request object
    next();
  } catch (error) {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = { JwtMaker, authenticateToken };