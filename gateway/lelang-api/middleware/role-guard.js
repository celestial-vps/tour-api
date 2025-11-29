require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findUserRole } = require('../repositories/user.repository'); // Import your user repository logic
const JWT_SECRET = process.env.SECREATKEY || 'celestial-super-secret-key-should-be-longer-123!'; // Ensure you set this in your environment
const { responseUnauthorized } = require('../common/build.response');
const authorizationHeaderKey = 'authorization';
const authorizationTypeBearer = 'bearer';
const authorizationPayloadKey = 'authorization_payload';

// Middleware function to check if the user has the required role
const RoleGuard = (role) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization; // Ensure this is defined

        if (!authHeader) {
            return res.status(401).json(responseUnauthorized("Authorization header is not provided"));
        }

        const fields = authHeader.split(' ');

        if (fields.length < 2) {
            return res.status(401).json(responseUnauthorized("Invalid authorization header format"));
        }

        const authorizationType = fields[0].toLowerCase();
        if (authorizationType !== 'bearer') {
            return res.status(401).json(responseUnauthorized(`Unsupported authorization type ${authorizationType}`));
        }

        const accessToken = fields[1];

        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET);

            if (!decoded || !decoded.username) {
                return res.status(401).json(responseUnauthorized("Invalid token"));
            }

            // Fetch user role from the repository
            // const { user, err } = await findUserRole(decoded.username);
            // if (err) {
            //     return res.status(403).json(responseUnauthorized(err.message || "Role not found"));
            // }
            // if (!user) {
            //     return res.status(401).json(responseUnauthorized("Data Not Found"));
            // }

            // // Check role
            // const roleName = user.roleOid ? user.roleOid.roleName  : null;
            // if (roleName !== role) {
            //     return res.status(403).json(responseUnauthorized("Forbidden: Insufficient role"));
            // }

            if (decoded.role !== role) {
                return res.status(403).json(responseUnauthorized("Forbidden: Insufficient role"));
            }

            // Attach payload to request object
            req[authorizationPayloadKey] = decoded;
            next();

        } catch (err) {
            return res.status(401).json(responseUnauthorized("Invalid token"));
        }
    };
};


module.exports = RoleGuard;