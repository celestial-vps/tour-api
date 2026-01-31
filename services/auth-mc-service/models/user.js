const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
    email: { type: String, maxlength: 150, unique: true, required: true },
    password: { type: String, maxlength: 150, required: true },
    androidToken: { type: String, default: null },
    iosToken: { type: String, default: null },
    webToken: { type: String, default: null },
    desktopToken: { type: String, default: null },
    expiredTime: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    activatedAt: { type: Date, default: null },
    roleOid: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', default: null },
    createdBy: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    lastModifiedBy: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null },
}, {
    timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
