CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`details` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_logs_created_at_idx` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `audit_logs_user_id_idx` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE TABLE `authors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`bio` text,
	`avatar_url` text,
	`social_links` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authors_slug_unique` ON `authors` (`slug`);--> statement-breakpoint
CREATE INDEX `authors_slug_idx` ON `authors` (`slug`);--> statement-breakpoint
CREATE INDEX `authors_user_id_idx` ON `authors` (`user_id`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE INDEX `categories_slug_idx` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`author_name` text NOT NULL,
	`author_email` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`ip_hash` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_post_id_idx` ON `comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `comments_status_idx` ON `comments` (`status`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`object_key` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`url` text NOT NULL,
	`alt_text` text,
	`width` integer,
	`height` integer,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_object_key_unique` ON `media` (`object_key`);--> statement-breakpoint
CREATE INDEX `media_object_key_idx` ON `media` (`object_key`);--> statement-breakpoint
CREATE TABLE `post_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_tags_post_id_idx` ON `post_tags` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_tags_tag_id_idx` ON `post_tags` (`tag_id`);--> statement-breakpoint
CREATE TABLE `post_views` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`visitor_hash` text NOT NULL,
	`viewed_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_views_post_id_idx` ON `post_views` (`post_id`);--> statement-breakpoint
CREATE INDEX `post_views_dedup_idx` ON `post_views` (`post_id`,`visitor_hash`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`category_id` text,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`cover_image` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`canonical_url` text,
	`reading_time` integer DEFAULT 1 NOT NULL,
	`published_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_at_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE INDEX `posts_author_id_idx` ON `posts` (`author_id`);--> statement-breakpoint
CREATE INDEX `posts_category_id_idx` ON `posts` (`category_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_token_idx` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `tags_slug_idx` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`avatar_url` text,
	`bio` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);