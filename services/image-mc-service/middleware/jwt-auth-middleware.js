require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SecreatKey || 'celestial-super-secret-key-should-be-longer-123!';

const authorizationHeaderKey = 'authorization';
const authorizationTypeBearer = 'bearer';
const authorizationPayloadKey = 'authorization_payload';

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers[authorizationHeaderKey];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is not provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }

  const [type, token] = parts;
  if (type.toLowerCase() !== authorizationTypeBearer) {
    return res.status(401).json({ error: `Unsupported authorization type: ${type}` });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Contoh: payload harus punya userId
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Token payload missing userId' });
    }

    // Attach user info ke req agar controller bisa pakai
    req[authorizationPayloadKey] = decoded;

    next();

  } catch (err) {
    console.error('Invalid token', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { jwtAuthMiddleware };
