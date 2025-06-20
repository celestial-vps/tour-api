const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningLevel = sequelize.define('LearningLevel', {
    oid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    LevelName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('academic', 'general'),
        allowNull: false,
        defaultValue: 'academic'
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
    tableName: 'learning_levels',
    timestamps: false,
    paranoid: true, // Enable soft deletes using deletedAt

});

// @ts-ignore
LearningLevel.associate = function (models) {
    // contoh relasi ke model TutorSubjectLevel
    // LearningLevel.hasMany(models.TutorSubjectLevel, {
    //   foreignKey: 'level_id',
    //   as: 'tutorSubjectLevels'
    // });
};

module.exports = LearningLevel;
