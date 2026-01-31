const jwt = require('jsonwebtoken');
const { findUserRole } = require('../repositories/user.repository'); // Import your user repository logic
const JWT_SECRET = process.env.JWT_SECRET || 'SecrteTokenSecrteToken'; // Ensure you set this in your environment

const authorizationHeaderKey = 'authorization';
const authorizationTypeBearer = 'bearer';
const authorizationPayloadKey = 'authorization_payload';
const { responseUnauthorized } = require('../common/build.response');

const JWTMiddleware = () => {
  return async (req, res, next) => {
    const authHeader = req.headers[authorizationHeaderKey];

    if (!authHeader) {
      const response = responseUnauthorized(
        "Authorization header is not provided"
      );
      return res.status(401).json(response);
      // return res.status(401).json({ error: 'Authorization header is not provided' });
    }

    const fields = authHeader.split(' ');

    if (fields.length < 2) {
      const response = responseUnauthorized(
        "Invalid authorization header format"
      );
      return res.status(401).json(response);
      // return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const authorizationType = fields[0].toLowerCase();
    if (authorizationType !== authorizationTypeBearer) {
      const response = responseUnauthorized(
        "Invalid authorization header format"
      );
      return res.status(401).json(`Unsupported authorization type ${authorizationType}`);

      // return res.status(401).json({ error: `Unsupported authorization type ${authorizationType}` });
    }

    const accessToken = fields[1];

    try {
      const payload = jwt.verify(accessToken, JWT_SECRET);

      if (payload && payload.username) {
        console.log("Username:", payload.username);

        try {
          // Assuming `findUserRole` function checks user roles
          const userRole = await findUserRole(payload.username);

          if (!userRole) {
            const response = responseUnauthorized(
              "Role Not Found"
            );
            return res.status(401).json(response);
            // console.log("Role Not Found");
            // return res.status(401).json({ error: 'Role not found' });
          }

          // Attach payload to request object
          req[authorizationPayloadKey] = payload;
          next();

        } catch (roleError) {
          const response = responseUnauthorized(
            roleError
          );
          // console.log("Role Error:", roleError);
          // return res.status(401).json({ error: 'Role not found' });
          return res.status(401).json(response);
        }

      } else {
        console.log("Username claim is missing or not a string");
        const response = responseUnauthorized(
          "Username claim is missing or not a string"
        );
        return res.status(401).json(response);
        // return res.status(401).json({ error: 'Invalid token payload' });
      }

    } catch (err) {
      console.log("Invalid token", err);

      const response = responseUnauthorized(err);
      return res.status(401).json(response);
      // return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = JWTMiddleware;