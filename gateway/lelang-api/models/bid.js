const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

const bidSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Otomatis generate ObjectId
    },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bidAmount: { type: Number, required: true },
    bidTime: { type: Date, default: Date.now }
}, {
    collection: 'bids',
    timestamps: false
});
