const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TutorBooking = sequelize.define('TutorBooking', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    student_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tutor_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    level_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
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
    tableName: 'bookings',
    timestamps: false, // karena kita handle manual created_at, updated_at
    paranoid: true,
});

// @ts-ignore
TutorBooking.associate = function (models) {
    TutorBooking.belongsTo(models.User, {
        foreignKey: 'student_id',
        as: 'student'
    });
    TutorBooking.belongsTo(models.TutorProfile, {
        foreignKey: 'tutor_id',
        as: 'tutor'
    });
    TutorBooking.belongsTo(models.Subject, {
        foreignKey: 'subject_id',
        as: 'subject'
    });
    TutorBooking.belongsTo(models.LearningLevel, {
        foreignKey: 'level_id',
        as: 'level'
    });
};

module.exports = TutorBooking;
