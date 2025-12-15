import { QueryRunner, Repository } from 'typeorm';
import { UserRole } from '../models/user-role.entity';
import { FilterUserRoleDto } from '../dtos/payload-user-role-dto';
export declare class UserRoleRepository {
    private readonly userRoleRepository;
    constructor(userRoleRepository: Repository<UserRole>);
    save(userRole: UserRole, queryRunner: QueryRunner): Promise<UserRole>;
    update(oid: string, userRole: UserRole, queryRunner: QueryRunner): Promise<UserRole>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<UserRole[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterUserRoleDto): Promise<{
        userRoles: UserRole[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterUserRoleDto): Promise<number>;
    advanceFilter(condition: FilterUserRoleDto): Promise<UserRole[]>;
    findById(oid: string): Promise<UserRole>;
}
