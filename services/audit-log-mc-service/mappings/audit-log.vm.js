// Mapping functions
async function toAuditLogResponse(auditLog) {
    const response = {
        oid: auditLog.oid,
        tableName: auditLog.tableName,
        recordOid: auditLog.recordOid,
        action: auditLog.action,
        status: auditLog.status,
        message: auditLog.message,
        previousData: auditLog.previousData,
        newData: auditLog.newData,
        changedFields: auditLog.changedFields,
        userOid: auditLog.userOid,
        ipAddress: auditLog.ipAddress,
        userAgent: auditLog.userAgent,        
        createdBy: auditLog.createdBy,
        updatedAt: auditLog.updatedAt
    };
    return response;
}

async function toAuditLogResponses(auditLogs) {
    const auditLogResponses = await Promise.all(auditLogs.map(toAuditLogResponse));
    return auditLogResponses;
}

// Export everything
module.exports = {
    toAuditLogResponse,
    toAuditLogResponses
};