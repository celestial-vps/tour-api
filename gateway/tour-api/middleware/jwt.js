require('dotenv').config();
const jwt = require('jsonwebtoken');
const { roleGuard } = require('./role-guard');
const SECRET_KEY = process.env.SECREATKEY || 'celestial-super-secret-key-should-be-longer-123!'; // Replace with your secret key


class JwtMaker {
  constructor() {
    this.secretKey = SECRET_KEY;
  }

  createToken(oid, emailName, role) {
    const payload = {
      userOid: oid,
      username: emailName,
      role: role,
      level: 'application',
      exp: Math.floor(Date.now() / 1000) + (10) // ⏱️ 1 menit exp: Math.floor(Date.now() / 1000) + (72 * 60 * 60) // 72 hours expiration
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretKey, { algorithm: 'HS256' }, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }

  // Refresh token
  createRefreshToken(oid, emailName, role) {
    const payload = {
      userOid: oid,
      username: emailName,
      role: role,
      type: 'refresh',
      exp: Math.floor(Date.now() / 1000) + (1 * 20) // exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 hari
    };
    return new Promise((resolve, reject) => {
      jwt.sign(payload, this.secretKey, { algorithm: 'HS256' }, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      });
    });
  }

  verifyToken(accessToken) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, this.secretKey, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
  }

  verifyRefreshToken(token) {
    const payload = jwt.verify(token, this.secretKey);

    // Pastikan payload adalah object
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid token payload');
    }

    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    return payload;
  }


  // getClaims(tokenString) {
  //   return new Promise((resolve, reject) => {
  //     jwt.decode(tokenString, { complete: true }, (err, decoded) => {
  //       if (err) return reject(err);
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
  } catch (err) {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = { JwtMaker, authenticateToken };
