const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Availability = sequelize.define('Availability', {
     oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        primaryKey: true,
    },
    tutorOid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weekday: {
        type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'availability',
    timestamps: false,
    underscored: true
});

// @ts-ignore
Availability.associate = function (models) {
    // Availability.belongsTo(models.TutorProfile, {
    //   foreignKey: 'tutor_id',
    //   as: 'tutor'
    // });
};
module.exports = Availability;
