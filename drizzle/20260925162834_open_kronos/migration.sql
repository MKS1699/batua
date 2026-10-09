CREATE TABLE `budget_memberships` (
	`id` text PRIMARY KEY,
	`budget_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_budget_memberships_budget_id_budgets_id_fk` FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`),
	CONSTRAINT `fk_budget_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
	CONSTRAINT `budget_user_unique` UNIQUE(`budget_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`owner_id` text NOT NULL,
	`period` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`is_shareable` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	CONSTRAINT `fk_budgets_owner_id_users_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY,
	`budget_id` text NOT NULL,
	`amount` real NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`original_currency` text DEFAULT 'INR' NOT NULL,
	`transaction_type` text DEFAULT 'expense' NOT NULL,
	`payment_method` text DEFAULT 'cash' NOT NULL,
	`transaction_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`created_by` text NOT NULL,
	CONSTRAINT `fk_transactions_budget_id_budgets_id_fk` FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`),
	CONSTRAINT `fk_transactions_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
