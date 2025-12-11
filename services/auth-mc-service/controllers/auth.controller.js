const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const { loginDto, registerDto } = require('../dtos/payload-user-dto');

const login = async (req, res) => {
    try {
        const { email, password, webToken } = req.body;

        // Validasi input
        const { error } = loginDto.validate({ email, password });
        if (error) return buildResponse.sendBadRequest(res, error.details[0].message);

        const { user, err } = await userService.login({ email, password, webToken });

        if (err) return buildResponse.sendQueryError(res, err.message, "login");

        return buildResponse.findOk(res, user, 1);

    } catch (err) {
        console.error('Login Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const register = async (req, res) => {
    try {
        const { error } = registerDto.validate(req.body);
        if (error) return buildResponse.sendBadRequest(res, error.details[0].message);

        const { user, err } = await userService.register(req.body);

        if (err) return buildResponse.sendQueryError(res, err.message, "register");

        return buildResponse.createOk(res, user, 1);

    } catch (err) {
        console.error('Register Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

module.exports = {
    login,
    register
};
