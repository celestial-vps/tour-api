const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Owner = sequelize.define('Owner', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.JSONB, // Assuming `Name` is a custom object (e.g., first & last name)
        allowNull: false,
    },  
}, {
    tableName: 'owners',
    timestamps: true,
    paranoid: true,
});
 

module.exports = Owner;
