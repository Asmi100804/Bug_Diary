CREATE TABLE "attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"bug_id" integer NOT NULL,
	"description" text NOT NULL,
	"worked" integer DEFAULT 0 NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bugs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"bug_number" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"error_message" text NOT NULL,
	"root_cause" text,
	"solution" text,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bugs_to_tags" (
	"bug_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "bugs_to_tags_bug_id_tag_id_pk" PRIMARY KEY("bug_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "bugs_to_technologies" (
	"bug_id" integer NOT NULL,
	"technology_id" integer NOT NULL,
	CONSTRAINT "bugs_to_technologies_bug_id_technology_id_pk" PRIMARY KEY("bug_id","technology_id")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"name" varchar(64) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"name" varchar(64) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_bug_id_bugs_id_fk" FOREIGN KEY ("bug_id") REFERENCES "public"."bugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bugs_to_tags" ADD CONSTRAINT "bugs_to_tags_bug_id_bugs_id_fk" FOREIGN KEY ("bug_id") REFERENCES "public"."bugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bugs_to_tags" ADD CONSTRAINT "bugs_to_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bugs_to_technologies" ADD CONSTRAINT "bugs_to_technologies_bug_id_bugs_id_fk" FOREIGN KEY ("bug_id") REFERENCES "public"."bugs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bugs_to_technologies" ADD CONSTRAINT "bugs_to_technologies_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_bug_id_idx" ON "attempts" USING btree ("bug_id");--> statement-breakpoint
CREATE INDEX "bugs_user_id_idx" ON "bugs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bugs_user_bug_number_unique" ON "bugs" USING btree ("user_id","bug_number");--> statement-breakpoint
CREATE INDEX "bugs_created_at_idx" ON "bugs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_user_slug_unique" ON "tags" USING btree ("user_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "technologies_user_slug_unique" ON "technologies" USING btree ("user_id","slug");