CREATE TABLE water_meters (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number TEXT NOT NULL UNIQUE,
    customer_oid UUID NOT NULL,
    installed_at DATE NOT NULL,
    replaced_at DATE,
    status TEXT NOT NULL,

    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_water_meter_customer FOREIGN KEY (customer_oid) REFERENCES customers(oid)
);
