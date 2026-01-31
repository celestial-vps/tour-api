import { DataSource } from 'typeorm';
export declare class UserRolesSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    run(): Promise<void>;
}
