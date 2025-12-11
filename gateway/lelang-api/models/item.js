const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // kalau memang perlu

const itemSchema = new mongoose.Schema({
     _id: { type: String, default: uuidv4 },
    itemCategoryOid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCategory',
        default: null
    },
    imageOid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ImageFile',
        required: false,    // tidak wajib
        default: null       // default null
    },

    itemName: { type: String, required: true },
    description: { type: String },
    startingPrice: { type: Number, required: true },
    owner: { type: String },

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
