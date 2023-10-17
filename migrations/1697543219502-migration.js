const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1697543219502 {
    name = 'Migration1697543219502'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "mqtt_host" ("id" SERIAL NOT NULL, "protocol" character varying NOT NULL, "host" character varying NOT NULL, "port" integer NOT NULL, "username" character varying, "password" character varying, CONSTRAINT "PK_beb7c081a9da1740a257e0a8753" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "mqtt_host"`);
    }
}
