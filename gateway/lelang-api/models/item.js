const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // kalau memang perlu

const itemSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    itemCategory: {
        type: String,
        ref: 'ItemCategory',
        default: null
    },
    imageOid: {
        type: String,
        ref: 'ImageFile',
        required: false,    // tidak wajib
        default: null       // default null
    },

    itemName: { type: String, required: true },
    startingPrice: { type: Number, required: true },
    seller: {
        type: String,      // Matches UserRole._id type (UUID)
        ref: 'Seller',   // Reference to UserRole collection
        default: null
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
    collection: 'items',
    timestamps: false,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
