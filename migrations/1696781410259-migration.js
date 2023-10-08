const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1696781410259 {
    name = 'Migration1696781410259'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "table" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "table" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "table" ADD "deleted_at" TIMESTAMP`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "table" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "table" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "table" DROP COLUMN "created_at"`);
    }
}
