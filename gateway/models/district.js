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
