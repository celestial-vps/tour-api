const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BankBranch = sequelize.define('BankBranch', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  bankOid: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  branchName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  bankAddress: {
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
  tableName: 'bank_banks',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
BankBranch.associate = (models) => {
  // Add associations here if needed
  // BankBranch.belongsTo(models.Bank, {
  //   foreignKey: 'bankOid',
  //   as: 'bank', // Optional alias
  //   onDelete: 'CASCADE',
  // });

};

module.exports = BankBranch;
