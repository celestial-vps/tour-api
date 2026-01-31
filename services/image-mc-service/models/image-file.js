const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ImageFile = sequelize.define('ImageFile', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    filePath: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    fileUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    fileMime: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isImage(value) {
                if (value && !value.startsWith('image/')) {
                    throw new Error('File must be an image MIME type.');
                }
            }
        }
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in bytes',
    },
    imageWidth: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Width in pixels',
    },
    imageHeight: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Height in pixels',
    },
    storageType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'local', // or 's3', 'cdn', etc.
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deletedBy: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'image_files',
    timestamps: true,
    paranoid: true,
});
ImageFile.beforeCreate(instance => {
  console.log('BeforeCreate hook oid:', instance.oid);
});
// @ts-ignore
ImageFile.associate = (models) => {
    // Define associations here if necessary
};

module.exports = ImageFile;
