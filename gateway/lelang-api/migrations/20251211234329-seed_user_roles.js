const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(db) {
    // Data role yang akan dimasukkan
    const roles = [
      {
        _id: uuidv4(),
        roleName: "Viewer",
        targetType: "System",
        isAdministrative: false,
        readState: true,
        writeState: false,
        createState: false,
        deleteState: false,
        navigateState: true,
        description: "Viewer role with read-only permissions",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        roleName: "Editor",
        targetType: "System",
        isAdministrative: false,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: false,
        navigateState: true,
        description: "Editor role with modify access",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4(),
        roleName: "Admin",
        targetType: "System",
        isAdministrative: true,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: true,
        navigateState: true,
        description: "Administrator with full access",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Insert ke collection userRoles
    await db.collection("userRoles").insertMany(roles);
  },

  async down(db) {
    // Hapus role-role yang telah dimasukkan
    await db.collection("userRoles").deleteMany({
      roleName: { $in: ["Viewer", "Editor", "Admin"] }
    });
  }
};
