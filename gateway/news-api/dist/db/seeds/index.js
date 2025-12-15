"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../../db/data-source");
const user_roles_seed_1 = require("./user-roles.seed");
async function runSeeders() {
    const dataSource = await data_source_1.AppDataSource.initialize();
    try {
        const userRolesSeeder = new user_roles_seed_1.UserRolesSeeder(dataSource);
        await userRolesSeeder.run();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await dataSource.destroy();
    }
}
runSeeders();
//# sourceMappingURL=index.js.map