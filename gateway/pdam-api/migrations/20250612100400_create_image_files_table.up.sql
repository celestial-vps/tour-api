CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE image_files (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT,
    file_path TEXT,
    file_mime TEXT,
    file_url TEXT,
    
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ
);
