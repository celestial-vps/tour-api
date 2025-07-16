CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    android_token VARCHAR(255),
    expired_time VARCHAR(50),
    is_active BOOLEAN,
    activated_at TIMESTAMPTZ,
    role_oid UUID,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ
);
