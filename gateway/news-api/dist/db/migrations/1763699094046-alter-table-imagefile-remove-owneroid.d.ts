import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AlterTableImagefileRemoveOwneroid1763699094046 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
