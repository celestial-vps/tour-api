 
-- Add columns for web, ios, and desktop tokens to device_tokens table
ALTER TABLE users
ADD COLUMN token_web TEXT,
ADD COLUMN token_ios TEXT,
ADD COLUMN token_desktop TEXT;
