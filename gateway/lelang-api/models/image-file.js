const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs


const imageFileSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    fileName: {
        type: String,
        maxlength: 255,
        required: false, // Set to true if it cannot be null
    },
    filePath: {
        type: String,
        maxlength: 255,
        required: false, // Set to true if it cannot be null
    },
    fileMime: {
        type: String,
        maxlength: 255,
        required: false, // Set to true if it cannot be null
    },
    fileUrl: {
        type: String,
        maxlength: 255,
        required: false, // Set to true if it cannot be null
    },
    description: {
        type: String,
        required: false, // Set to true if it cannot be null
    },
    createdBy: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedBy: {
        type: String,
        required: false,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
    deletedBy: {
        type: String,
        required: false,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
}, {
    collection: 'image_files',
    timestamps: true,
});


const ImageFile = mongoose.model('ImageFile', imageFileSchema);

module.exports = ImageFile;