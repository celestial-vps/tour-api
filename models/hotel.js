const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('hotels', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
},
  hotelName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  star_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
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
  tableName: 'hotels',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// Associations
// @ts-ignore
Hotel.associate = (models) => {
  Hotel.hasMany(models.HotelRoom, {
    foreignKey: 'hotelOid',
    as: 'hotelRooms', // Optional alias
    onDelete: 'CASCADE',
  });
};

module.exports = Hotel;
