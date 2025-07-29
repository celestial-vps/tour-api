const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Mongoose schema for UserRole
const userRoleSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId() // Explicitly generate ObjectId
    },
    roleName: {
        type: String,
        unique: true,
        required: true
    },
    targetType: {
        type: String,
        default: null
    },
    isAdministrative: {
        type: Boolean,
        default: false,
        select: false // Hide from read operations
    },
    readState: {
        type: Boolean,
        default: false
    },
    writeState: {
        type: Boolean,
        default: false
    },
    createState: {
        type: Boolean,
        default: false
    },
    deleteState: {
        type: Boolean,
        default: false
    },
    navigateState: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: null,
    },
    createdBy: {
        type: String,
        default:null,
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
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    collection: 'userRoles',
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Compile schema into a model
const UserRole = mongoose.models.UserRole || mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;