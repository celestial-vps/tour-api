const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subdistrict = sequelize.define('Subdistrict', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    }, 
    subdistrictName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
}, {
    tableName: 'subdistricts',
    timestamps: true,
    paranoid: true,
});

Subdistrict.associate = (models) => {
    // Example: if you want to associate with District
    // Subdistrict.belongsTo(models.District, {
    //     foreignKey: 'district',
    //     targetKey: 'oid',
    //     as: 'districtInfo',
    // });
};

module.exports = Subdistrict;
