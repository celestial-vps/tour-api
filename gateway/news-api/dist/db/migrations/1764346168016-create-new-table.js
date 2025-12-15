"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewTable1764346168016 = void 0;
class CreateNewTable1764346168016 {
    name = 'CreateNewTable1764346168016';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tags\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`slug\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_b3aa10c29ea4e61a830362bd25\` (\`slug\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`message\` text NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`articles\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`thumbnail\` varchar(255) NULL, \`status\` enum ('draft', 'published', 'deleted') NOT NULL DEFAULT 'draft', \`views\` int NOT NULL DEFAULT '0', \`author_id\` varchar(36) NULL, \`category_id\` varchar(36) NULL, UNIQUE INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` (\`slug\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`likes\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`article_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comments\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`article_id\` varchar(36) NULL, \`user_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookmarks\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`user_id\` varchar(36) NULL, \`article_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`banners\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, \`article_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article_tags\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`article_id\` varchar(36) NULL, \`tag_id\` varchar(36) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_9a8a82462cab47c73d25f49261f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_6515da4dff8db423ce4eb841490\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_e025eeefcdb2a269c42484ee43f\` FOREIGN KEY (\`category_id\`) REFERENCES \`news_categories\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_0deaa79a910af56b33472c90ee0\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_3f519ed95f775c781a254089171\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_e9b498cca509147e73808f9e593\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4c675567d2a58f0b07cef09c13d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookmarks\` ADD CONSTRAINT \`FK_58a0fbaee65cd8959a870ee678c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bookmarks\` ADD CONSTRAINT \`FK_7d82c6ffea39d2fc3e095149225\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`banners\` ADD CONSTRAINT \`FK_d7c36be9c374b9591467db04679\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_f8c9234a4c4cb37806387f0c9e9\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`article_tags\` ADD CONSTRAINT \`FK_1325dd0b98ee0f8f673db6ce194\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_1325dd0b98ee0f8f673db6ce194\``);
        await queryRunner.query(`ALTER TABLE \`article_tags\` DROP FOREIGN KEY \`FK_f8c9234a4c4cb37806387f0c9e9\``);
        await queryRunner.query(`ALTER TABLE \`banners\` DROP FOREIGN KEY \`FK_d7c36be9c374b9591467db04679\``);
        await queryRunner.query(`ALTER TABLE \`bookmarks\` DROP FOREIGN KEY \`FK_7d82c6ffea39d2fc3e095149225\``);
        await queryRunner.query(`ALTER TABLE \`bookmarks\` DROP FOREIGN KEY \`FK_58a0fbaee65cd8959a870ee678c\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4c675567d2a58f0b07cef09c13d\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_e9b498cca509147e73808f9e593\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_3f519ed95f775c781a254089171\``);
        await queryRunner.query(`ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_0deaa79a910af56b33472c90ee0\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_e025eeefcdb2a269c42484ee43f\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_6515da4dff8db423ce4eb841490\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_9a8a82462cab47c73d25f49261f\``);
        await queryRunner.query(`DROP TABLE \`article_tags\``);
        await queryRunner.query(`DROP TABLE \`banners\``);
        await queryRunner.query(`DROP TABLE \`bookmarks\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
        await queryRunner.query(`DROP TABLE \`likes\``);
        await queryRunner.query(`DROP INDEX \`IDX_1123ff6815c5b8fec0ba9fec37\` ON \`articles\``);
        await queryRunner.query(`DROP TABLE \`articles\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_b3aa10c29ea4e61a830362bd25\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
    }
}
exports.CreateNewTable1764346168016 = CreateNewTable1764346168016;
//# sourceMappingURL=1764346168016-create-new-table.js.map