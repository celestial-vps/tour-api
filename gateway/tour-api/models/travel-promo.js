const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TravelPromo = sequelize.define('TravelPromo', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 20] // Kode promo 3-20 karakter
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'percentage'
    },
    discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    usageLimit: {
        type: DataTypes.INTEGER,
        allowNull: true, // Optional
        validate: {
            min: 1
        }
    },
    usedCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    validFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    validUntil: {
        type: DataTypes.DATEONLY,
        allowNull: true // Bisa null untuk promo permanen
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    hooks: {
        beforeValidate: (promo) => {
            // Auto-uppercase promo code
            // if (promo.code) {
            //     promo.code = promo.code.toUpperCase();
            // }
        }
    }
});

// @ts-ignore
TravelPromo.associate = (models) => {

};

module.exports = TravelPromo;
