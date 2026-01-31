"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRolesSeeder = void 0;
const user_role_entity_1 = require("../../models/user-role.entity");
class UserRolesSeeder {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async run() {
        const { v4: uuidv4 } = await import('uuid');
        const repo = this.dataSource.getRepository(user_role_entity_1.UserRole);
        const systemUser = '00000000-0000-0000-0000-000000000000';
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
                createdBy: systemUser,
                lastModifiedBy: systemUser,
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
                createdBy: systemUser,
                lastModifiedBy: systemUser,
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
                createdBy: systemUser,
                lastModifiedBy: systemUser,
            },
        ];
        for (const role of roles) {
            const exists = await repo.findOneBy({ roleName: role.roleName });
            if (!exists) {
                await repo.save(role);
            }
        }
        console.log('✅ User roles seeded!');
    }
}
exports.UserRolesSeeder = UserRolesSeeder;
//# sourceMappingURL=user-roles.seed.js.map