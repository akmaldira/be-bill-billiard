const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1696767509981 {
    name = 'Migration1696767509981'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "table_order" ADD "life_time" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "table_order" DROP COLUMN "life_time"`);
    }
}
