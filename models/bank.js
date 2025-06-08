const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bank = sequelize.define('banks', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
    tableName: 'banks',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
Bank.associate = (models) => {
   
};

module.exports = Bank;
