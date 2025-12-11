const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs


const transactionSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    finalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
    paymentTime: { type: Date, default: null }
}, {
    collection: 'transactions',
    timestamps: false
});
