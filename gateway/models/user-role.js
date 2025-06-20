const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const UserRole = sequelize.define('UserRole', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUIDV4 for consistency
        primaryKey: true,
    },
    roleName: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    targetType: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    isAdministrative: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    readState: {
        type: DataTypes.BOOLEAN,
        field: 'readState',
    },
    writeState: {
        type: DataTypes.BOOLEAN,
        field: 'writeState',
    },
    createState: {
        type: DataTypes.BOOLEAN,
        field: 'createState',
    },
    deleteState: {
        type: DataTypes.BOOLEAN,
        field: 'deleteState',
    },
    navigateState: {
        type: DataTypes.BOOLEAN,
        field: 'navigateState',
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
    tableName: 'user_roles',
    timestamps: true,
    paranoid: true,
});

// Define associations
// @ts-ignore
UserRole.associate = (models) => {
    UserRole.hasMany(models.User, {
        foreignKey: 'roleOid', // Ensure this matches User's foreign key
        sourceKey: 'oid',
        as: 'users', // Define alias for use in queries if needed
    });
};

module.exports = UserRole;
