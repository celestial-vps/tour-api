 
const AuditLog = require('./audit-log');

const models = {
    AuditLog, 
};

// Initialize associations
Object.values(models).forEach(model => {
    // @ts-ignore
    if (model.associate) {
        // @ts-ignore
        model.associate(models);
    }
});

module.exports = models;