CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE user_roles (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    target_type VARCHAR(50) NOT NULL,
    is_administrative BOOLEAN NOT NULL,
    read_state BOOLEAN,
    write_state BOOLEAN,
    create_state BOOLEAN,
    delete_state BOOLEAN,
    navigate_state BOOLEAN,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ
);
