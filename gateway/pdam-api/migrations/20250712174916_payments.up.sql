 
CREATE TABLE payments (
    oid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_oid UUID NOT NULL,
    payment_date DATE NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_method TEXT NOT NULL,

    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_modified_by UUID NOT NULL,
    updated_at TIMESTAMPTZ,
    deleted_by UUID,
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_payment_bill FOREIGN KEY (bill_oid) REFERENCES bills(oid)
);
