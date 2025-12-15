const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const bidSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    auctionOid: { type: String, ref: 'Auction' },
    userOid: { type: String, ref: 'User' },
    bidAmount: { type: Number, required: true },
    bidTime: { type: Date, default: Date.now },
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
    collection: 'bids', // Specify the collection name
    timestamps: false, // Disable automatic timestamps (createdAt, updatedAt)
});

// Create the model
const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;