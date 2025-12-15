"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBankTable1763562372278 = void 0;
class CreateBankTable1763562372278 {
    name = 'CreateBankTable1763562372278';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`user_roles\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`roleName\` varchar(50) NOT NULL, \`targetType\` varchar(50) NULL, \`isAdministrative\` tinyint NOT NULL DEFAULT 0, \`readState\` tinyint NOT NULL DEFAULT 0, \`writeState\` tinyint NOT NULL DEFAULT 0, \`createState\` tinyint NOT NULL DEFAULT 0, \`deleteState\` tinyint NOT NULL DEFAULT 0, \`navigateState\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_ecc9f04daea3e5f057ca85c661\` (\`roleName\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`email\` varchar(150) NOT NULL, \`password\` varchar(150) NOT NULL, \`birthday\` timestamp NULL, \`memberNumber\` varchar(50) NULL, \`androidToken\` varchar(255) NULL, \`expiredTime\` varchar(50) NULL, \`isActive\` tinyint NULL DEFAULT 1, \`activatedAt\` timestamp NULL, \`roleOid\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`image_files\` (\`oid\` varchar(36) NOT NULL, \`fileName\` varchar(255) NULL, \`filePath\` varchar(255) NULL, \`fileMime\` varchar(255) NULL, \`fileUrl\` varchar(255) NULL, \`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp NULL, \`deletedBy\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`banks\` (\`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`lastModifiedBy\` varchar(255) NULL, \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedBy\` varchar(255) NULL, \`deletedAt\` timestamp(6) NULL, \`oid\` varchar(36) NOT NULL, \`bankCode\` varchar(10) NOT NULL, \`bankName\` varchar(40) NULL, \`shortName\` varchar(4) NULL, UNIQUE INDEX \`IDX_b0620ac9c6d8c6ad754021d425\` (\`bankCode\`), PRIMARY KEY (\`oid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_2e25b2e69b1398b9fc4d52fd709\` FOREIGN KEY (\`roleOid\`) REFERENCES \`user_roles\`(\`oid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_2e25b2e69b1398b9fc4d52fd709\``);
        await queryRunner.query(`DROP INDEX \`IDX_b0620ac9c6d8c6ad754021d425\` ON \`banks\``);
        await queryRunner.query(`DROP TABLE \`banks\``);
        await queryRunner.query(`DROP TABLE \`image_files\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_ecc9f04daea3e5f057ca85c661\` ON \`user_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles\``);
    }
}
exports.CreateBankTable1763562372278 = CreateBankTable1763562372278;
//# sourceMappingURL=1763562372278-CreateBankTable.js.map