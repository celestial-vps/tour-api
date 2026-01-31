const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const bidderSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: {
        type: String, // Diubah menjadi String karena diambil dari microservice
        required: true
    },

    fullName: {
        type: String,
        maxlength: 100,
        required: true,
    },

    ktpNumber: {
        type: String,
        maxlength: 50,
        required: true,
        unique: true, // KTP harus unik
    },

    address: {
        type: String,
        default: null,
    },

    phone: {
        type: String,
        maxlength: 20,
        default: null,
    }, 

    createdBy: {
        type: String,
        required: true,
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
    collection: 'bidders',
    timestamps: false, // Kalau mau otomatis timestamps bisa diubah ke true
});

// Create the model
const Bidder = mongoose.model('Bidder', bidderSchema);

module.exports = Bidder;
