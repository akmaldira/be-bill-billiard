const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1697826169777 {
    name = 'Migration1697826169777'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_item" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "created_at"`);
    }
}
