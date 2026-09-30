CREATE TABLE `post_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`created_by` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_versions_post_id_idx` ON `post_versions` (`post_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_versions_post_version_idx` ON `post_versions` (`post_id`,`version_number`);