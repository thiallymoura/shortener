CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_url_unique" UNIQUE("short_url")
);
--> statement-breakpoint
DROP TABLE "uploads" CASCADE;--> statement-breakpoint
CREATE INDEX "links_created_at_idx" ON "links" USING btree ("created_at");