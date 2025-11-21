import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableImagefileRemoveOwneroid1763699094046 implements MigrationInterface {
    name = 'AlterTableImagefileRemoveOwneroid1763699094046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`ownerId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`ownerId\` varchar(255) NOT NULL`);
    }

}
