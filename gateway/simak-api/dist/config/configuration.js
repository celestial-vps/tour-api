"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '3306', 10),
    dbUsername: process.env.DB_USERNAME || 'root',
    dbPassword: process.env.DB_PASSWORD || 'Serverh5n&*#',
    dbName: process.env.DB_NAME || 'simakdb',
    auditTrailUrl: process.env.AUDIT_TRAIL_SERVICE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
});
//# sourceMappingURL=configuration.js.map