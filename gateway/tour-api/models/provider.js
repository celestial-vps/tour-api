const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Provider = sequelize.define('Provider', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
}, 
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bankOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  subDistrictOid: {
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
  tableName: 'providers',
  timestamps: true,
  paranoid: true, // For soft deletes using deletedAt
});

// Associations
// @ts-ignore
Provider.associate = (models) => {
  Provider.belongsTo(models.Subdistrict, {
    foreignKey: 'subDistrictOid', // Corrected to match the field in the Provider model
    targetKey: 'oid',
    as: 'subDistrict', // Alias for the association
  });

  // Provider.belongsTo(models.Bank, {
  //   foreignKey: 'bankOid', // Corrected to match the field in the Provider model
  //   targetKey: 'oid',
  //   as: 'bank', // Alias for the association
  // });
};

module.exports = Provider;
