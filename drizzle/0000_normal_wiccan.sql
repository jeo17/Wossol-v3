DO $$ BEGIN
 CREATE TYPE "public"."format_code" AS ENUM('A3', 'A4', 'A5');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('Male', 'Female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('super_admin', 'admin', 'seller');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"country_code" varchar NOT NULL,
	CONSTRAINT "cities_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "cities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"currency_code" varchar NOT NULL,
	CONSTRAINT "countries_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "countries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "currencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"symbol" varchar NOT NULL,
	CONSTRAINT "currencies_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "currencies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feesStates" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "feesStates_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "feesStates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formats" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" "format_code" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "formats_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "groups_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "groups_name_unique" UNIQUE("name"),
	CONSTRAINT "groups_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups_roles" (
	"group_name" varchar NOT NULL,
	"role_name" varchar NOT NULL,
	CONSTRAINT "groups_roles_group_name_role_name_pk" PRIMARY KEY("group_name","role_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups_users" (
	"user_id" uuid NOT NULL,
	"group_name" varchar NOT NULL,
	CONSTRAINT "groups_users_group_name_user_id_pk" PRIMARY KEY("group_name","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "roles_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "roles_name_unique" UNIQUE("name"),
	CONSTRAINT "roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_type" "user_type" NOT NULL,
	"user_name" varchar,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"address" varchar NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" "gender" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "towns" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"city_code" varchar,
	CONSTRAINT "towns_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "towns_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parcel_slip_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"qrcode" varchar NOT NULL,
	"barcode" varchar NOT NULL,
	"description" varchar NOT NULL,
	"template" varchar NOT NULL,
	"receiver_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"format_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "parcel_slip_templates_receiver_id_unique" UNIQUE("receiver_id"),
	CONSTRAINT "parcel_slip_templates_seller_id_unique" UNIQUE("seller_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pricingTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "pricingTypes_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "pricingTypes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recievers" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"second_phone_number" varchar,
	"address" varchar NOT NULL,
	"town_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "recievers_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orderStates" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "orderStates_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "orderStates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subOrderStates" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar NOT NULL,
	"name_en" varchar NOT NULL,
	"name_ar" varchar,
	"name_fr" varchar,
	"active" boolean DEFAULT true NOT NULL,
	"order_code" varchar NOT NULL,
	CONSTRAINT "subOrderStates_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "subOrderStates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cities" ADD CONSTRAINT "cities_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "countries" ADD CONSTRAINT "countries_currency_code_currencies_code_fk" FOREIGN KEY ("currency_code") REFERENCES "public"."currencies"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups_roles" ADD CONSTRAINT "groups_roles_group_name_groups_name_fk" FOREIGN KEY ("group_name") REFERENCES "public"."groups"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups_roles" ADD CONSTRAINT "groups_roles_role_name_roles_name_fk" FOREIGN KEY ("role_name") REFERENCES "public"."roles"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups_users" ADD CONSTRAINT "groups_users_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "groups_users" ADD CONSTRAINT "groups_users_group_name_groups_name_fk" FOREIGN KEY ("group_name") REFERENCES "public"."groups"("name") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "towns" ADD CONSTRAINT "towns_city_code_cities_code_fk" FOREIGN KEY ("city_code") REFERENCES "public"."cities"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parcel_slip_templates" ADD CONSTRAINT "parcel_slip_templates_receiver_id_recievers_uuid_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."recievers"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parcel_slip_templates" ADD CONSTRAINT "parcel_slip_templates_seller_id_users_uuid_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parcel_slip_templates" ADD CONSTRAINT "parcel_slip_templates_format_id_formats_uuid_fk" FOREIGN KEY ("format_id") REFERENCES "public"."formats"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recievers" ADD CONSTRAINT "recievers_town_id_towns_uuid_fk" FOREIGN KEY ("town_id") REFERENCES "public"."towns"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subOrderStates" ADD CONSTRAINT "subOrderStates_order_code_orderStates_code_fk" FOREIGN KEY ("order_code") REFERENCES "public"."orderStates"("code") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "group_idx" ON "groups" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roles_idx" ON "roles" USING btree ("name");