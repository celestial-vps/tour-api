 
-- Remove columns for web, ios, and desktop tokens from device_tokens table
ALTER TABLE users
DROP COLUMN IF EXISTS token_web,
DROP COLUMN IF EXISTS token_ios,
DROP COLUMN IF EXISTS token_desktop;
