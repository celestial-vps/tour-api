import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableNews1763633590470 implements MigrationInterface {
    name = 'CreateTableNews1763633590470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`news_categories\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`categoryName\` varchar(40) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`news\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`summary\` varchar(500) NULL, \`author\` varchar(100) NULL, \`status\` varchar(20) NOT NULL DEFAULT 'draft', \`publishedAt\` timestamp NULL, \`views\` int NOT NULL DEFAULT '0', \`tags\` varchar(255) NULL, \`language\` varchar(10) NULL, \`categoryOid\` varchar(36) NULL, \`imageOid\` varchar(36) NULL, UNIQUE INDEX \`REL_ea2abce960e2552908ed41b316\` (\`imageOid\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`createdBy\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`lastModifiedBy\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`ownerType\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`ownerId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_eed90e5c53451c9bc784c81b1aa\` FOREIGN KEY (\`categoryOid\`) REFERENCES \`news_categories\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_ea2abce960e2552908ed41b3165\` FOREIGN KEY (\`imageOid\`) REFERENCES \`image_files\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_ea2abce960e2552908ed41b3165\``);
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_eed90e5c53451c9bc784c81b1aa\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`ownerType\``);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`deletedBy\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`updatedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`lastModifiedBy\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`createdAt\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`createdBy\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`REL_ea2abce960e2552908ed41b316\` ON \`news\``);
        await queryRunner.query(`DROP TABLE \`news\``);
        await queryRunner.query(`DROP TABLE \`news_categories\``);
    }

}
