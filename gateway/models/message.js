const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    conversationOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    senderOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
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
