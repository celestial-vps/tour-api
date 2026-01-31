const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },
    brandName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    imageOid: {
        type: DataTypes.UUID,
        allowNull: false,
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
    tableName: 'brands',
    timestamps: true,      // adds createdAt and updatedAt
    paranoid: true,        // adds deletedAt (for soft deletes)
});

// @ts-ignore
Brand.associate = (models) => {
    // Define associations here if necessary, for example:
    // Brand.hasMany(models.Product, { foreignKey: 'brandId' });
};

module.exports = Brand;
