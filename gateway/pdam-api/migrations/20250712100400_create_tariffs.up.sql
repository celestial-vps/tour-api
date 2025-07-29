CREATE TABLE tarifs (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_type TEXT NOT NULL,
    min_volume INTEGER NOT NULL,
    max_volume INTEGER NOT NULL,
    price_per_m3 DECIMAL(10,2) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,

    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ
);
