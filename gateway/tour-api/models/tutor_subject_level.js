// models/tutor_subject_level.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TutorSubjectLevel = sequelize.define('TutorSubjectLevel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tutorOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    subjectOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    levelOid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    hourlyRate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
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
    tableName: 'tutor_subject_levels',
    timestamps: false,
    paranoid: true,
});

// @ts-ignore
TutorSubjectLevel.associate = function (models) {
    TutorSubjectLevel.belongsTo(models.LearningLevel, {
        foreignKey: 'level_id',
        as: 'level'
    });
    // Tambahkan relasi lain ke tutor, subject, jika ada
};


module.exports = TutorSubjectLevel;