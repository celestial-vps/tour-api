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
  createdBy: {
    type: DataTypes.UUID,
  }, 
  lastModifiedBy: {
    type: DataTypes.UUID,
  }, 
  deletedBy: {
    type: DataTypes.UUID,
  },
  deletedAt: {
    type: DataTypes.DATE,
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
