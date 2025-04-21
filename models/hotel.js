const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Hotel = sequelize.define('Hotel', {
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
  tableName: 'hotels',
  timestamps: true,
  paranoid: true, // for soft deletes using deletedAt
});

// Associations
Hotel.associate = (models) => {
  Hotel.hasMany(models.HotelRoom, {
    foreignKey: 'hotelOid',
    as: 'hotelRooms', // Optional alias
    onDelete: 'CASCADE',
  });
};

module.exports = Hotel;
