const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
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
    tableName: 'customers',
    timestamps: true,
    paranoid: true,
});
 

module.exports = Customer;
