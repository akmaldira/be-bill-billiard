const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1699802180855 {
    name = 'Migration1699802180855'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" ADD "is_notified" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "is_notified"`);
    }
}
