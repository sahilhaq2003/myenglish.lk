-- Add subscription columns to users table
ALTER TABLE users ADD COLUMN subscription_status ENUM('free', 'trial', 'pro') DEFAULT 'free';
ALTER TABLE users ADD COLUMN trial_start_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN trial_end_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN pro_start_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN pro_end_at TIMESTAMP NULL;
