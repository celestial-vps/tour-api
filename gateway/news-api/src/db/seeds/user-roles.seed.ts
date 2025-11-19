import { DataSource } from 'typeorm';
import { UserRole } from '../../models/user-role.entity';

export class UserRolesSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    // Import UUID secara dinamis supaya kompatibel ESM
    const { v4: uuidv4 } = await import('uuid');
    const repo = this.dataSource.getRepository(UserRole);

    // Bisa pakai UUID "system" sebagai createdBy / lastModifiedBy
    const systemUser = '00000000-0000-0000-0000-000000000000';

    const roles: Partial<UserRole>[] = [
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
