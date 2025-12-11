// services/auth.service.js
const { OAuth2Client } = require('google-auth-library');
const buildResponse = require('../common/build.response');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (payload) => {
  try {
    const idToken = payload.idToken;
    if (!idToken) throw new Error('ID Token is missing');

    // Verifikasi ID Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const userData = ticket.getPayload(); // { email, name, picture, sub, ... }

    // Buat JWT aplikasi sendiri atau session token
    const appToken = generateAppToken(userData); // contoh function untuk JWT aplikasi

    return {
      user: userData,
      token: appToken,
      err: null
    };

  } catch (error) {
    console.error("Google Auth Error:", error.message || error);
    return {
      user: null,
      token: null,
      err: buildResponse.responseInternalServerError(error).data.error
    };
  }
};

function generateAppToken(user) {
  // Contoh menggunakan jsonwebtoken
  const jwt = require('jsonwebtoken');
  const payload = { email: user.email, name: user.name, sub: user.sub };
  return jwt.sign(payload, process.env.APP_SECRET || 'secret', { expiresIn: '1h' });
}

module.exports = {
  loginWithGoogle
};
