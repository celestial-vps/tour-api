// models/subject.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


  const Subject = sequelize.define('Subject', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true // Misalnya: "Akademik", "Coding", "Soft Skill"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    tableName: 'subjects',
    timestamps: false,
    paranoid: true, // Enables soft delete
  });

  // @ts-ignore
  Subject.associate = function(models) {
    // Jika kamu punya model TutorSubjectLevel
    Subject.hasMany(models.TutorSubjectLevel, {
      foreignKey: 'subject_id',
      as: 'tutorSubjectLevels'
    });

    // Bisa juga relasi ke Bookings, jika Booking punya subject_id
    Subject.hasMany(models.Booking, {
      foreignKey: 'subject_id',
      as: 'bookings'
    });
  };

module.exports = Subject;
