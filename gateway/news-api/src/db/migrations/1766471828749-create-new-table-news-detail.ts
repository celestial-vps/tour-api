import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTableNewsDetail1766471828749 implements MigrationInterface {
    name = 'CreateNewTableNewsDetail1766471828749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`news_image_detail\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`role\` varchar(50) NOT NULL, \`imageOid\` varchar(36) NOT NULL, \`newsOid\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_33fc88e25f6d34ac87844a96fd\` (\`imageOid\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_eed90e5c53451c9bc784c81b1aa\``);
        await queryRunner.query(`ALTER TABLE \`news\` CHANGE \`categoryOid\` \`categoryOid\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`news_image_detail\` ADD CONSTRAINT \`FK_33fc88e25f6d34ac87844a96fdd\` FOREIGN KEY (\`imageOid\`) REFERENCES \`image_files\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`news_image_detail\` ADD CONSTRAINT \`FK_ecdd9ff3bd6959322562baee029\` FOREIGN KEY (\`newsOid\`) REFERENCES \`news\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_eed90e5c53451c9bc784c81b1aa\` FOREIGN KEY (\`categoryOid\`) REFERENCES \`news_categories\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`news\` DROP FOREIGN KEY \`FK_eed90e5c53451c9bc784c81b1aa\``);
        await queryRunner.query(`ALTER TABLE \`news_image_detail\` DROP FOREIGN KEY \`FK_ecdd9ff3bd6959322562baee029\``);
        await queryRunner.query(`ALTER TABLE \`news_image_detail\` DROP FOREIGN KEY \`FK_33fc88e25f6d34ac87844a96fdd\``);
        await queryRunner.query(`ALTER TABLE \`news\` CHANGE \`categoryOid\` \`categoryOid\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`news\` ADD CONSTRAINT \`FK_eed90e5c53451c9bc784c81b1aa\` FOREIGN KEY (\`categoryOid\`) REFERENCES \`news_categories\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX \`REL_33fc88e25f6d34ac87844a96fd\` ON \`news_image_detail\``);
        await queryRunner.query(`DROP TABLE \`news_image_detail\``);
    }

}
