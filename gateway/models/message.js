const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('messages', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    tableName: 'messages',
    timestamps: true,
    paranoid: true, // Soft delete support
});

// @ts-ignore
Message.associate = (models) => {
    Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
        targetKey: 'oid', // Assuming Conversation also uses UUID primary key
    });

    Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        targetKey: 'oid',
    });
};

module.exports = Message;
