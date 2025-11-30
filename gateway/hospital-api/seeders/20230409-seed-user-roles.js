const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (pool) => {
    const roles = [
      {
        oid: uuidv4(),
        roleName: 'Admin',
        targetType: 'System',
        isAdministrative: true,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: true,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: uuidv4(),
        roleName: 'Editor',
        targetType: 'System',
        isAdministrative: false,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: false,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        oid: uuidv4(),
        roleName: 'Viewer',
        targetType: 'System',
        isAdministrative: false,
        readState: true,
        writeState: false,
        createState: false,
        deleteState: false,
        navigateState: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const values = roles.map(role => [
      role.oid,
      role.roleName,
      role.targetType,
      role.isAdministrative,
      role.readState,
      role.writeState,
      role.createState,
      role.deleteState,
      role.navigateState,
      role.createdAt,
      role.updatedAt,
    ]);

    await pool.query(`
      INSERT INTO user_roles (
        oid, roleName, targetType, isAdministrative, readState, writeState,
        createState, deleteState, navigateState, createdAt, updatedAt
      ) VALUES ?`, [values]);
  },

  down: async (pool) => {
    await pool.query('DELETE FROM user_roles');
  }
};
