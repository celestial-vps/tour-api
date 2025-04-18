const jwt = require('jsonwebtoken');

const IP_ADDRESS = '192.168.0.107'; // This should match your IP or issuer value

class JwtClaims {
  constructor(payload) {
    this.userOid = payload.userOid || '';
    this.username = payload.username || '';
    this.roles = payload.roles || [];
    this.exp = payload.exp || 0;
    this.iat = payload.iat || 0;
    this.iss = payload.iss || '';
    this.aud = payload.aud || '';
  }

  valid() {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (this.verifyExpiresAt(now) && this.verifyIssuer(IP_ADDRESS)) {
      return null; // Token is valid
    }
    return new Error('Token is invalid');
  }

  verifyExpiresAt(now) {
    return this.exp > now; // Check if token is not expired
  }

  verifyIssuer(expectedIssuer) {
    return this.iss === expectedIssuer; // Check if the issuer is correct
  }

  verifyAudience(expectedAudience) {
    return this.aud === expectedAudience; // Check if the audience is correct
  }
}

const verifyToken = (token, secretKey) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    const claims = new JwtClaims(decoded);

    const validationError = claims.valid();
    if (validationError) {
      throw validationError;
    }

    return claims; // Return validated claims
  } catch (err) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  JwtClaims,
  verifyToken,
};
