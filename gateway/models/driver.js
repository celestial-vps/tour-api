const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    userOid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'oid'
        }
    },
    licenseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    licenseExpiry: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    vehicleOid: {
        type: DataTypes.BIGINT,
        allowNull: true, // Optional
        references: {
            model: 'vehicles',
            key: 'oid'
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'suspended'),
        defaultValue: 'active',
        allowNull: false
    },
    hiredAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    terminatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    ratingAvg: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0,
            max: 5
        }
    },
    totalTrips: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
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
    tableName: 'drivers',
    timestamps: true,
    paranoid: true, // for soft deletes using deletedAt
});

// @ts-ignore
Driver.associate = (models) => {
    // Belongs to User
    Driver.belongsTo(models.User, {
        foreignKey: 'userOid',
        as: 'user',
        onDelete: 'RESTRICT'
    });

    // Belongs to Vehicle (optional)
    Driver.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleOid',
        as: 'vehicle',
        onDelete: 'SET NULL'
    });

    // Has many Schedules
    Driver.hasMany(models.Schedule, {
        foreignKey: 'driver_id',
        as: 'schedules'
    });

    // Has many DriverRatings (if you have such a table)
    Driver.hasMany(models.DriverRating, {
        foreignKey: 'driver_id',
        as: 'ratings'
    });
};

module.exports = Driver;








