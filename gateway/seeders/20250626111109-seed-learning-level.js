'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('learning_levels', [
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Beginner',
        type: 'academic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Elementary',
        type: 'academic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Pre-Intermediate',
        type: 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Intermediate',
        type: 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Upper-Intermediate',
        type: 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Advanced',
        type: 'academic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Proficient',
        type: 'academic',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Language Starter',
        type: 'language',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Skill Builder',
        type: 'skill',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Test Preparation',
        type: 'test-prep',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Early Childhood',
        type: 'early-child',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'General Knowledge',
        type: 'general',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: Sequelize.literal('uuid_generate_v4()'),
        levelName: 'Specialized Language',
        type: 'language',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('learning_levels', null, {});
  }
};
