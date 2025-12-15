module.exports = {
  async up(db, client) {
    // Create userRoles collection with validator
    await db.createCollection("userRoles", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["roleName"],
          properties: {
            _id: { bsonType: "string" }, // UUID string
            roleName: {
              bsonType: "string",
              description: "Role name is required"
            },
            targetType: { bsonType: ["string", "null"] },
            isAdministrative: {
              bsonType: "bool",
              description: "Administrative flag"
            },
            readState: { bsonType: "bool" },
            writeState: { bsonType: "bool" },
            createState: { bsonType: "bool" },
            deleteState: { bsonType: "bool" },
            navigateState: { bsonType: "bool" },
            description: { bsonType: ["string", "null"] },
            createdBy: { bsonType: ["string", "null"] },
            createdAt: { bsonType: "date" },
            lastModifiedBy: { bsonType: ["string", "null"] },
            updatedAt: { bsonType: "date" },
            deletedBy: { bsonType: ["string", "null"] },
            deletedAt: { bsonType: ["date", "null"] },
            users: {
              bsonType: "array",
              items: { bsonType: "objectId" }
            }
          }
        }
      }
    });

    // Create unique index for roleName
    await db.collection("userRoles").createIndex(
      { roleName: 1 },
      { unique: true }
    );
  },

  async down(db, client) {
    await db.collection("userRoles").drop();
  }
};
