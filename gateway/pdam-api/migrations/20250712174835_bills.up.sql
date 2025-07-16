 
CREATE TABLE bills (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usage_oid UUID NOT NULL,
    billing_date DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status TEXT NOT NULL, -- Unpaid / Paid / Overdue

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_bill_usage FOREIGN KEY (usage_oid) REFERENCES usage_records(oid)
);
