CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE customers (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Embedded Name fields
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT,

    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,

    image_oid UUID,

    -- Embedded TransactionRecord fields
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_image_oid FOREIGN KEY (image_oid) REFERENCES image_files(oid)
);
