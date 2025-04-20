const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const District = sequelize.define('District', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  cityOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  districtName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.UUID,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
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
  tableName: 'districts',
  timestamps: true,
  paranoid: true,
});

District.associate = (models) => {
    District.belongsTo(models.City, {
        foreignKey: 'cityOid',
        as: 'city',
        onDelete: 'CASCADE',
      });
};

module.exports = District;
