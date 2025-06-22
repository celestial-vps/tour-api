const userService = require('../services/user.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;
        const { user, err } = await userService.create(req.body, userJwt.userOid);

        if (err) {
            await recordAuditTrail("CREATE", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "insert");
        }
        await recordAuditTrail("CREATE", "users", user, req, 'SUCCESS', 'Create User success');
        return buildResponse.createOk(res, user, 1);

    } catch (err) {
        await recordAuditTrail("CREATE", "users", err, req, 'ERROR', err.message);
        console.error('Controller Create Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const update = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;

        const { user, err } = await userService.update(req.params.oid, req.body, userJwt.userOid);

        if (err) {
            await recordAuditTrail("UPDATE", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "update");
        }
        await recordAuditTrail("UPDATE", "users", user, req, 'SUCCESS', 'Update User success');
        return buildResponse.updateOk(res, user, 1);
    } catch (err) {
        console.error('Controller Update Error:', err);
        await recordAuditTrail("UPDATE", "users", err, req, 'ERROR', err.message);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const remove = async (req, res) => {
    try {
        const { user, err } = await userService.deleted(req.params.oid);

        if (err) {
            await recordAuditTrail("DELETE", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message || err, "delete");
        }
        await recordAuditTrail("DELETE", "users", user, req, 'SUCCESS', 'Delete User success');
        return buildResponse.sendDeleteOk(res, user);
    } catch (err) {
        await recordAuditTrail("DELETE", "users", err, req, 'ERROR', err.message);
        console.error('Controller Delete Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const findAll = async (req, res) => {
    try {
        const { users, err } = await userService.findAll();

        if (err) {
            await recordAuditTrail("READ", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "get all");
        }
        await recordAuditTrail("READ", "users", users, req, 'SUCCESS', 'Get all Users success');
        return buildResponse.findOk(res, users, users.length);
    } catch (err) {
        await recordAuditTrail("READ", "users", err, req, 'ERROR', err.message);
        console.error('Controller Find All Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const find = async (req, res) => {
    try {
        const filters = pick(req.body, ['userCode', 'userName', 'search']);

        const options = {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            pageIndex: parseInt(req.query.pageIndex, 10) || 1,
            pageSize: parseInt(req.query.pageSize, 10) || 10,
        };

        const result = await userService.findPage(filters, options);

        if (result.err) {
            await recordAuditTrail("READ", "users", result.err, req, 'FAILED', result.err.message);
            return buildResponse.sendInternalServerError(res, result.err.message);
        }
        await recordAuditTrail("READ", "users", result.users, req, 'SUCCESS', 'Get Users with filters success');
        return buildResponse.sendPagination(res, result.users, result.count, options.pageIndex, options.pageSize);
    } catch (error) {
        console.error('Controller error:', error);
        await recordAuditTrail("READ", "users", error, req, 'ERROR', error.message);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const findById = async (req, res) => {
    try {
        const options = {
            include: [], // bisa ditambahkan jika ada relasi
        };

        const { user, err } = await userService.findById(req.params.oid, options);

        if (err) {
            await recordAuditTrail("READ", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "get by id");
        }

        if (!user) return buildResponse.sendDataNotFound(res);
        await recordAuditTrail("READ", "users", user, req, 'SUCCESS', 'Get User by ID success');
        return buildResponse.findOk(res, user);
    } catch (err) {
        await recordAuditTrail("READ", "users", err, req, 'ERROR', err.message);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};


const getProfile = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;        

        const options = {
            include: [], // bisa ditambahkan jika ada relasi
        };

        const { user, err } = await userService.findByMe(userJwt.userOid, options);

        if (err) {
            await recordAuditTrail("READ", "users", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "get by id");
        }

        if (!user) return buildResponse.sendDataNotFound(res);
        await recordAuditTrail("READ", "users", user, req, 'SUCCESS', 'Get User by ID success');
        return buildResponse.findOk(res, user);
    } catch (err) {
        await recordAuditTrail("READ", "users", err, req, 'ERROR', err.message);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};


module.exports = {
    create,
    update,
    remove,
    findAll,
    find,
    findById, getProfile
};
