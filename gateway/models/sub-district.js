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
    createdBy: {
        type: DataTypes.UUID, // DataTypes.UUID is consistent
    },
    lastModifiedBy: {
        type: DataTypes.UUID,
    },
    deletedBy: {
        type: DataTypes.UUID,
    },
}, {
    tableName: 'subdistricts',
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
