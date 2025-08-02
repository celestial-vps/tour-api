const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserRole = require('./user-role'); // Ensure correct path

// Define Mongoose schema
const userSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() // Explicitly generate ObjectId
    },
    email: {
        type: String,
        maxlength: 150,
        unique: true,
        required: true
    },
    name: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        maxlength: 150,
        required: true
    },
    birthday: {
        type: Date
    },
    memberNumber: {
        type: String,
        default: null
    },
    androidToken: {
        type: String,
        default: null
    },
    iosToken: {
        type: String,
        default: null
    },
    webToken: {
        type: String,
        default: null
    },
    desktopToken: {
        type: String,
        default: null
    }, expiredTime: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    activatedAt: {
        type: Date,
        default: null
    },
    roleOid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole',
        default: null
    },
    description: {
        type: String,
        default: null,
    },
    createdBy: {
        type: String,
        default: null,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    lastModifiedBy: {
        type: String,
        default: null,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: false,
    },
    deletedBy: {
        type: String,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Compile schema into a model if not already defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;