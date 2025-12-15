import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableImagefile1763697773225 implements MigrationInterface {
    name = 'AlterTableImagefile1763697773225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`createdBy\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`lastModifiedBy\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`deletedBy\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`deletedAt\` timestamp(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`lastModifiedBy\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`createdBy\``);
    }

}
