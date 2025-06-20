const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subdistrict = sequelize.define('Subdistrict', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    districtOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subDistrictName: {
        type: DataTypes.STRING,
        field: 'subDistrictName', // 👈 this maps the JS name to DB column
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.STRING,
        field: 'postalCode', // 👈 this maps the JS name to DB column
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
    tableName: 'sub_districts',
    timestamps: true,  // Automatically handles createdAt, updatedAt
    paranoid: true,    // Soft delete functionality (deletedAt)
});

// Associations
// @ts-ignore
Subdistrict.associate = (models) => {
    Subdistrict.belongsTo(models.District, {
        foreignKey: 'districtOid',
        targetKey: 'oid',
        as: 'district',
    });

    // Subdistrict.hasMany(models.Hotel, {
    //     foreignKey: 'subDistrictOid',
    //     as: 'hotels',
    //     onDelete: 'CASCADE',
    // });

    // Subdistrict.hasMany(models.Customer, {
    //     foreignKey: 'subDistrictOid',
    //     as: 'customers',
    //     onDelete: 'CASCADE',
    // });

    // Subdistrict.hasMany(models.Owner, {
    //     foreignKey: 'subDistrictOid',
    //     as: 'owners',
    //     onDelete: 'CASCADE',
    // });
};

module.exports = Subdistrict;
