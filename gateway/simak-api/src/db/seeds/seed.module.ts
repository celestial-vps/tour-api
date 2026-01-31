import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, UserRoleSchema } from '../../models/user-role';
import { UserRoleSeeder } from './user-role.seeder';
// import { UserRole, UserRoleSchema } from '../schema/user-role.schema';
// import { UserRoleSeeder } from './seeds/user-role.seeder';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/simakdb'),
        MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }]),
    ],
    providers: [UserRoleSeeder],
})
export class SeedModule { }
