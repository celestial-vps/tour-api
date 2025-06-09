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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
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
