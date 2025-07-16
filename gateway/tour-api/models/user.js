const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    androidToken: {
        type: DataTypes.STRING(255),
        allowNull: true, // null allowed
        field: 'androidToken', // maps to the 'androidToken' column in the database
    },
    expiredTime: {
        type: DataTypes.STRING(50),
        allowNull: true, // null allowed
        field: 'expiredTime', // maps to the 'expiredTime' column in the database
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true, // null allowed
        field: 'isActive', // maps to the 'isActive' column in the database
    },
    activatedAt: {
        type: DataTypes.DATE, // Timestamp equivalent in Sequelize
        allowNull: true, // null allowed as per sql.NullTime in Go
        field: 'activatedAt', // maps to the 'activatedAt' column in the database
    },
    roleOid: {
        type: DataTypes.UUID,
        allowNull: true, // Set to true if role can be null
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,       // Allow NULL values (equivalent to *string in Go)
        defaultValue: null,    // Explicitly set the default value to NULL
        field: 'description',  // Column name in the database
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
        allowNull: true, // Adjust based on your requirements
    },
    deletedBy: {
        type: DataTypes.UUID,
        allowNull: true, // Adjust based on your requirements
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Adjust based on your requirements    
    },
}, {
    timestamps: true,
    paranoid: true, // Enables soft deletes
});

// Define associations
// @ts-ignore
User.associate = (models) => {
    User.belongsTo(models.UserRole, { foreignKey: 'roleOid', as: 'userRole' });
};

module.exports = User;
