const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs


const auctionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Otomatis generate ObjectId
    },
    itemOid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: false,    // tidak wajib
        default: null       // default null
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'active', 'ended', 'cancelled'], default: 'pending' },

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
    collection: 'auctions',
    timestamps: false,
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
