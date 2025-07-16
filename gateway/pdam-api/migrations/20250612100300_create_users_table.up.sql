CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    androidToken VARCHAR(255),
    expiredTime VARCHAR(50),
    isActive BOOLEAN,
    activated_at TIMESTAMPTZ,
    roleOid UUID,
    createdBy UUID,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    lastModifiedBy UUID,
    updatedAt TIMESTAMPTZ,
    deletedBy UUID,
    deletedAt TIMESTAMPTZ
);
