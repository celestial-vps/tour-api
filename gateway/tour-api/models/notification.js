// models/notification.js

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: {
      type: DataTypes.STRING(50), // contoh: 'booking', 'payment', 'system'
      allowNull: true
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
    tableName: 'notifications',
    timestamps: false,
    underscored: true
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Notification;
};
