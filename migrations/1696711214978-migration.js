const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1696711214978 {
    name = 'Migration1696711214978'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "table" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "device_id" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "table_order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duration" integer NOT NULL, "stoped_at" TIMESTAMP, "used_table_id" integer, "table_id" integer, "order_id" uuid, CONSTRAINT "REL_c1dcf1d3fe637765d24052b197" UNIQUE ("table_id"), CONSTRAINT "REL_a5cb6c4d3ad2c5e252a124568a" UNIQUE ("order_id"), CONSTRAINT "PK_14de8334c60f15f18ac55b262a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'cashier', 'chef', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."user_role_enum" NOT NULL DEFAULT 'cashier', "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "order" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "costumer_name" character varying NOT NULL, "paid" boolean NOT NULL DEFAULT false, "price" integer NOT NULL, "note" character varying, "created_by_id" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_item_status_enum" AS ENUM('pending', 'cooking', 'done', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "fnb_id" integer NOT NULL, "quantity" integer NOT NULL, "status" "public"."order_item_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."fnb_category_enum" AS ENUM('food', 'beverage', 'other')`);
        await queryRunner.query(`CREATE TABLE "fnb" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "image" character varying, "name" character varying NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "category" "public"."fnb_category_enum" NOT NULL DEFAULT 'other', "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_b7983e1ab06288461c71de44058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "table_order" ADD CONSTRAINT "FK_d5840a18ec6c605c76c16b1b547" FOREIGN KEY ("used_table_id") REFERENCES "table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "table_order" ADD CONSTRAINT "FK_c1dcf1d3fe637765d24052b1973" FOREIGN KEY ("table_id") REFERENCES "table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "table_order" ADD CONSTRAINT "FK_a5cb6c4d3ad2c5e252a124568a2" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_baf41162b735ea17e1bf967c9e5" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_c17ca876efad8a7196b3334e044" FOREIGN KEY ("fnb_id") REFERENCES "fnb"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_c17ca876efad8a7196b3334e044"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_baf41162b735ea17e1bf967c9e5"`);
        await queryRunner.query(`ALTER TABLE "table_order" DROP CONSTRAINT "FK_a5cb6c4d3ad2c5e252a124568a2"`);
        await queryRunner.query(`ALTER TABLE "table_order" DROP CONSTRAINT "FK_c1dcf1d3fe637765d24052b1973"`);
        await queryRunner.query(`ALTER TABLE "table_order" DROP CONSTRAINT "FK_d5840a18ec6c605c76c16b1b547"`);
        await queryRunner.query(`DROP TABLE "fnb"`);
        await queryRunner.query(`DROP TYPE "public"."fnb_category_enum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "table_order"`);
        await queryRunner.query(`DROP TABLE "table"`);
    }
}
