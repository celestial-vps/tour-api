const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const AuditLog = sequelize.define('AuditLog', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    tableName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recordOid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('CREATE',
            'UPDATE',
            'DELETE',
            'READ',
            'LOGIN',
            'LOGOUT',
            'APPROVE',
            'REJECT',
            'IMPORT',
            'EXPORT'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILED', 'ERROR'),
        allowNull: false,
        defaultValue: 'SUCCESS'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true
    },
    previousData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    newData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    changedFields: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    userOid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'audit_logs',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
AuditLog.associate = (models) => {

};

module.exports = AuditLog;