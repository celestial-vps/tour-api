const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversationMember = sequelize.define('conversation_members', {
  conversationOid: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'conversations',
      key: 'oid',
    },
    onDelete: 'CASCADE',
  },
  userOid: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'oid',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'conversation_members',
  timestamps: false,
});

module.exports = ConversationMember;
