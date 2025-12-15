const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const oauthClientSchema = new Schema({
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  redirectUris: [String],
  grants: [String], // e.g. ['password','refresh_token','authorization_code']
  scopes: [String], // e.g. ['read','write']
  isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.models.OAuthClient || mongoose.model('OAuthClient', oauthClientSchema);
