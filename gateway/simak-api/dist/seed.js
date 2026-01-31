"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const user_role_seeder_1 = require("./db/seeds/user-role.seeder");
const seed_module_1 = require("./db/seeds/seed.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(seed_module_1.SeedModule);
    const seeder = app.get(user_role_seeder_1.UserRoleSeeder);
    await seeder.seed();
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed.js.map