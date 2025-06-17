const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPostalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  }, 
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  }, 
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'customers',
  timestamps: true,
  paranoid: true, // for soft deletes
});

// Associations
// @ts-ignore
Customer.associate = (models) => {
  // Associate with the Bank model
  Customer.belongsTo(models.Bank, {
    foreignKey: 'bankOid',
    as: 'bank', // Alias for the association
    onDelete: 'CASCADE',
  });

  // Example association with a Subdistrict (fixing to refer to Subdistrict)
  // Customer.belongsTo(models.Subdistrict, {
  //   foreignKey: 'subDistrictOid', // Assuming a field for subdistrict in the customer model
  //   targetKey: 'oid',
  //   as: 'subDistrict', // Alias for association
  //   onDelete: 'CASCADE',
  // });
};

module.exports = Customer;
