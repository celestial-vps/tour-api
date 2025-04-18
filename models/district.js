const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const District = sequelize.define('District', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    districtName: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
}, {
    tableName: 'districts',
    timestamps: true,
    paranoid: true,
});

District.associate = (models) => {
    // Example: if you want to associate with City later
    // District.belongsTo(models.City, {
    //     foreignKey: 'city',
    //     targetKey: 'oid',
    //     as: 'cityInfo',
    // });
};

module.exports = District;
