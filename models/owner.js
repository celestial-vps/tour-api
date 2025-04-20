const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Owner = sequelize.define('Owner', {
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  lastModifiedBy: {
    type: DataTypes.UUID,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedBy: {
    type: DataTypes.UUID,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'owners',
  timestamps: true,
  paranoid: true, // For soft deletes using deletedAt
});

// Associations
Owner.associate = (models) => {
  Owner.belongsTo(models.Subdistrict, {
    foreignKey: 'subDistrictOid', // Corrected to match the field in the Owner model
    targetKey: 'oid',
    as: 'subDistrict', // Alias for the association
  });

  Owner.belongsTo(models.Bank, {
    foreignKey: 'bankOid', // Corrected to match the field in the Owner model
    targetKey: 'oid',
    as: 'bank', // Alias for the association
  });
};

module.exports = Owner;
