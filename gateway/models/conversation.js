const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('conversations', {
  oid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  isGroup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true, // Optional name for group chats
  },
  deletedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'conversations',
  timestamps: true,
  paranoid: true, // Enables soft delete
});

// @ts-ignore
Conversation.associate = (models) => {
  Conversation.belongsToMany(models.User, {
    through: models.ConversationMember,
    foreignKey: 'conversationOid',
    otherKey: 'userOid',
  });

  Conversation.hasMany(models.Message, {
    foreignKey: 'conversationId',
    sourceKey: 'oid',
  });
};

module.exports = Conversation;
