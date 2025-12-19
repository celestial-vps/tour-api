require('dotenv').config();
const jwt = require('jsonwebtoken');
const { responseUnauthorized } = require('../common/build.response');
const { findUserRole } = require('../repositories/user.repository'); // Import your user repository logic
const JWT_SECRET = process.env.SECREATKEY || 'celestial-super-secret-key-should-be-longer-123!'; // Ensure you set this in your environment

const authorizationHeaderKey = 'authorization';
const authorizationTypeBearer = 'bearer';
const authorizationPayloadKey = 'authorization_payload';

// Middleware function to check if the user has the required role
const roleGuard = (role) => {
    return async (req, res, next) => {
        const authHeader = req.headers[authorizationHeaderKey];

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is not provided' });
        }

        const fields = authHeader.split(' ');

        if (fields.length < 2) {
            return res.status(401).json({ error: 'Invalid authorization header format' });
        }

        const authorizationType = fields[0].toLowerCase();
        if (authorizationType !== authorizationTypeBearer) {
            return res.status(401).json({ error: `Unsupported authorization type ${authorizationType}` });
        }

        const accessToken = fields[1];

        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET);
            // if (decoded && decoded.username) {
            //     console.log("Username:", decoded.username);

            //     try {
            //         const { result, err } = await findUserRole(decoded.username);
            //         if (err!=null) {
            //             return res.status(403).json({ error: err });
            //         }
            //         if (result.length == 0) {
            //             return res.status(401).json({ error: 'Data Not Found' });
            //         }
            //         if (result[0].userRole.roleName !== role) {
            //             return res.status(403).json({ error: 'Forbidden: Insufficient role' });
            //         }

            //         // Attach payload to request object
            //         req[authorizationPayloadKey] = decoded;
            //         next();

            //     } catch (roleError) {
            //         console.error("Role Error:", roleError);
            //         return res.status(401).json({ error: 'Role not found' });
            //     }

            // } else {
            //     return res.status(401).json({ error: 'Invalid token claims' });
            // }
            if (!decoded || !decoded.username) {
                return res.status(401).json(responseUnauthorized("Invalid token"));
            }
            if (decoded.role !== role) {
                return res.status(403).json(responseUnauthorized("Forbidden: Insufficient role"));
            }
            req[authorizationPayloadKey] = decoded;
            next();

        } catch (err) {
            console.error("Invalid token", err);
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

module.exports = { roleGuard };
