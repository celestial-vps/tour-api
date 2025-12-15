"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlterTableImagefileRemoveOwneroid1763699094046 = void 0;
class AlterTableImagefileRemoveOwneroid1763699094046 {
    name = 'AlterTableImagefileRemoveOwneroid1763699094046';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`image_files\` DROP COLUMN \`ownerId\``);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`image_files\` ADD \`ownerId\` varchar(255) NOT NULL`);
    }
}
exports.AlterTableImagefileRemoveOwneroid1763699094046 = AlterTableImagefileRemoveOwneroid1763699094046;
//# sourceMappingURL=1763699094046-alter-table-imagefile-remove-owneroid.js.map