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
    isAdministrative: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'user_roles',
    timestamps: true,
    paranoid: true,
});

// Define associations
UserRole.associate = (models) => {
    UserRole.hasMany(models.User, {
        foreignKey: 'roleOid', // Ensure this matches User's foreign key
        sourceKey: 'oid',
        as: 'users', // Define alias for use in queries if needed
    });
};

module.exports = UserRole;
