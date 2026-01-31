const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// UserToken schema
const userTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Relasi ke collection User
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    deviceType: {
        type: String, // misal: 'android', 'ios', 'web', 'desktop'
        required: true
    },
    expiresAt: {
        type: Date, // expiry access token
        required: true
    },
    refreshExpiresAt: {
        type: Date, // expiry refresh token
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // otomatis buat createdAt & updatedAt
});

const UserToken = mongoose.models.UserToken || mongoose.model('UserToken', userTokenSchema);
module.exports = UserToken;
