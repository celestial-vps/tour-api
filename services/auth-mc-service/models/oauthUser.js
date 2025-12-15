const mongoose = require('mongoose');

const OAuthUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date
});

module.exports = mongoose.model('OAuthUser', OAuthUserSchema);
