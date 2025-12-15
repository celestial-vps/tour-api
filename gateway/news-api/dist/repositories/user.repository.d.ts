import { QueryRunner, Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { FilterUserDto } from '../dtos/payload-user-dto';
export declare class UserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    save(user: User, queryRunner: QueryRunner): Promise<User>;
    update(oid: string, user: User, queryRunner: QueryRunner): Promise<User>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<User[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterUserDto): Promise<User[]>;
    findCountByCriteria(condition: FilterUserDto): Promise<number>;
    advanceFilter(condition: FilterUserDto): Promise<User[]>;
    findById(oid: string): Promise<User>;
}
