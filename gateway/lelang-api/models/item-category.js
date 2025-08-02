const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // kalau memang perlu
const Schema = mongoose.Schema;


const itemCategorySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    categoryName: { type: String, required: true },


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
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item' 
    }]
}, {
    collection: 'item_categories',
    timestamps: false,
});

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);

module.exports = ItemCategory;
