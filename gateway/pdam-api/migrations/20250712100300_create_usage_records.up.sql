CREATE TABLE usage_records (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_oid UUID NOT NULL,
    billing_month DATE NOT NULL,
    start_reading INTEGER NOT NULL,
    end_reading INTEGER NOT NULL,
    consumption_m3 INTEGER NOT NULL,

    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_usage_meter FOREIGN KEY (meter_oid) REFERENCES water_meters(oid)
);
