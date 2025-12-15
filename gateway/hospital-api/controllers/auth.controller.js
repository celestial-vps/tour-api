
const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');
const { OAuth2Client } = require('google-auth-library');


const login = async (req, res) => {
    try {
        console.error('Controller Create:');
        const condition = {
            email: req.body.email,
            password: req.body.password
        };

        const { user, err } = await userService.login(condition);
        console.error('Controller Create err 1:', err);
        if (err) {
            return buildResponse.sendQueryError(res, err.message, "insert");
        }

        return buildResponse.findOk(res, user, 1)

    } catch (err) {
        console.error('Controller Create Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const register = async (req, res) => {
    try {
        const { user, err } = await userService.register(req.body);
        if (err) {
            return buildResponse.sendQueryError(res, err.message, "insert");
        }

        return buildResponse.createOk(res, user, 1);
    } catch (err) {
        console.error('Controller Create Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

module.exports = {
    login,
    register,
};
