export declare abstract class BaseEntity {
    description?: string;
    createdBy: string;
    createdAt: Date;
    lastModifiedBy?: string;
    updatedAt?: Date;
    deletedBy?: string;
    deletedAt?: Date;
}
