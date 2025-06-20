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
  tableName: 'districts',
  timestamps: true,
  paranoid: true,
});

// @ts-ignore
District.associate = (models) => {
  District.belongsTo(models.City, {
    foreignKey: 'cityOid',
    as: 'city',
    onDelete: 'CASCADE',
  });
};

module.exports = District;
