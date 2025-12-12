// const { MongoClient } = require('mongodb');
// require('dotenv').config();

// const mongoURI = process.env.MONGO_URL;
// const database = process.env.DATABASE;

// async function seedDatabase() {
//     const client = new MongoClient(mongoURI);

//     try {
//         await client.connect();
//         const db = client.db(database);
        
//         // Define your collections and the data to seed
//         const userRolesCollection = db.collection('userRoles');

//         // Data to be inserted
//         const userRoles = [
//             {
//                 roleName: "Admin",
//                 targetType: "System",
//                 isAdministrative: true,
//                 readState: true,
//                 writeState: true,
//                 createState: true,
//                 deleteState: true,
//                 navigateState: true,
//                 createdAt: new Date(), // Adding createdAt timestamp
//                 updatedAt: new Date(), // Adding updatedAt timestamp
//             },
//             {
//                 roleName: "Editor",
//                 targetType: "System",
//                 isAdministrative: false,
//                 readState: true,
//                 writeState: true,
//                 createState: true,
//                 deleteState: false,
//                 navigateState: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//             {
//                 roleName: "Viewer",
//                 targetType: "System",
//                 isAdministrative: false,
//                 readState: true,
//                 writeState: false,
//                 createState: false,
//                 deleteState: false,
//                 navigateState: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//              {
//                 roleName: "Seller",
//                 targetType: "System",
//                 isAdministrative: false,
//                 readState: true,
//                 writeState: false,
//                 createState: false,
//                 deleteState: false,
//                 navigateState: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//              {
//                 roleName: "Buyyer",
//                 targetType: "System",
//                 isAdministrative: false,
//                 readState: true,
//                 writeState: false,
//                 createState: false,
//                 deleteState: false,
//                 navigateState: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             },
//         ];

//         // Insert data into collections
//         const result = await userRolesCollection.insertMany(userRoles);
//         console.log(`${result.insertedCount} user roles seeded successfully`);

//     } catch (err) {
//         console.error('Error seeding database:', err);
//     } finally {
//         await client.close();
//     }
// }

// // Execute the seeding function
// seedDatabase();