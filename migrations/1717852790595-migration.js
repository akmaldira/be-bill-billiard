const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1717852790595 {
    name = 'Migration1717852790595'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "table" ADD "price_each_minutes" integer NOT NULL DEFAULT '583'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_price_table" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_price_item" integer NOT NULL DEFAULT '0'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_price_item"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_price_table"`);
        await queryRunner.query(`ALTER TABLE "table" DROP COLUMN "price_each_minutes"`);
    }
}
