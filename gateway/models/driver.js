const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
    //    console.log('models.TravelSchedule:', models.TravelSchedule?.name);
    // console.log('models.TravelSchedule keys:', Object.keys(models.TravelSchedule || {}));
    // console.log('models.TravelSchedule instanceof Model:', models.TravelSchedule?.prototype instanceof sequelize.model);

    // Has many Schedules
    // Driver.hasMany(models.TravelSchedule, {
    //     foreignKey: 'driverOid',
    //     as: 'schedules'
    // });

    // Has many DriverRatings (if you have such a table)
    // Driver.hasMany(models.DriverRating, {
    //     foreignKey: 'driverOid',
    //     as: 'ratings'
    // });
};

module.exports = Driver;








