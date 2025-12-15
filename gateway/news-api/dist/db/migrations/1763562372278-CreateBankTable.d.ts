import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateBankTable1763562372278 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
