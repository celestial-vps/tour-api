import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; 
import { UserRole, UserRoleDocument } from '../../models/user-role';

@Injectable()
export class UserRoleSeeder {
  constructor(
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRoleDocument>,
  ) {}

  async seed() {
    const count = await this.userRoleModel.countDocuments({});
    if (count > 0) {
      console.log('UserRole seed already exists. Skipping...');
      return;
    }

    const now = new Date();

    const roles = [
      {
        roleName: 'Admin',
        targetType: 'system',
        isAdministrative: true,
        readState: true,
        writeState: true,
        createState: true,
        deleteState: true,
        navigateState: true,
        createdBy: 'system',
        createdAt: now,
      },
      {
        roleName: 'Viewer',
        targetType: 'general',
        isAdministrative: false,
        readState: true,
        writeState: false,
        createState: false,
        deleteState: false,
        navigateState: true,
        createdBy: 'system',
        createdAt: now,
      },
      {
        roleName: 'Editor',
        targetType: 'general',
        isAdministrative: false,
        readState: true,
        writeState: false,
        createState: false,
        deleteState: false,
        navigateState: true,
        createdBy: 'system',
        createdAt: now,
      },
    ];

    await this.userRoleModel.insertMany(roles);

    console.log('UserRole seed created.');
  }
}
