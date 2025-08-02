const auctionService = require('../services/auction.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;
        const { auction, err } = await auctionService.create(req.body, userJwt.userOid);

        if (err) {
            await recordAuditTrail("CREATE", "auctions", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "insert");
        }
        await recordAuditTrail("CREATE", "auctions", auction, req, 'SUCCESS', 'Create Auctions success');
        return buildResponse.createOk(res, auction, 1);

    } catch (err) {
        await recordAuditTrail("CREATE", "auctions", err, req, 'ERROR', err.message);
        console.error('Controller Create Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const update = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;

        const { auction, err } = await auctionService.update(req.params.oid, req.body, userJwt.userOid);

        if (err) {
            await recordAuditTrail("UPDATE", "auctions", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "update");
        }
        await recordAuditTrail("UPDATE", "auctions", auction, req, 'SUCCESS', 'Update Auctions success');
        return buildResponse.updateOk(res, auction, 1);
    } catch (err) {
        console.error('Controller Update Error:', err);
        await recordAuditTrail("UPDATE", "auctions", err, req, 'ERROR', err.message);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const remove = async (req, res) => {
    try {
        const { auction, err } = await auctionService.deleted(req.params.oid);

        if (err) {
            await recordAuditTrail("DELETE", "auctions", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message || err, "delete");
        }
        await recordAuditTrail("DELETE", "auctions", auction, req, 'SUCCESS', 'Delete Auctions success');
        return buildResponse.sendDeleteOk(res, auction);
    } catch (err) {
        await recordAuditTrail("DELETE", "auctions", err, req, 'ERROR', err.message);
        console.error('Controller Delete Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const findAll = async (req, res) => {
    try {
        const { auctions, err } = await auctionService.findAll();

        if (err) {
            await recordAuditTrail("READ", "auctions", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "get all");
        }
        await recordAuditTrail("READ", "auctions", auctions, req, 'SUCCESS', 'Get all Auctionss success');
        return buildResponse.findOk(res, auctions, auctions.length);
    } catch (err) {
        await recordAuditTrail("READ", "auctions", err, req, 'ERROR', err.message);
        console.error('Controller Find All Error:', err);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

const find = async (req, res) => {
    try {
        const filters = pick(req.body, ['title', 'description', 'search']);

        const options = {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            pageIndex: parseInt(req.query.pageIndex, 10) || 1,
            pageSize: parseInt(req.query.pageSize, 10) || 10,
        };

        const result = await auctionService.findPage(filters, options);

        if (result.err) {
            await recordAuditTrail("READ", "auctions", result.err, req, 'FAILED', result.err.message);
            return buildResponse.sendInternalServerError(res, result.err.message);
        }
        await recordAuditTrail("READ", "auctions", result.auctions, req, 'SUCCESS', 'Get Auctionss with filters success');
        return buildResponse.sendPagination(res, result.auctions, result.count, options.pageIndex, options.pageSize);
    } catch (error) {
        console.error('Controller error:', error);
        await recordAuditTrail("READ", "auctions", error, req, 'ERROR', error.message);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const findById = async (req, res) => {
    try {
        const options = {
            include: [], // bisa ditambahkan jika ada relasi
        };

        const { auction, err } = await auctionService.findById(req.params.oid, options);

        if (err) {
            await recordAuditTrail("READ", "auctions", err, req, 'FAILED', err.message);
            return buildResponse.sendQueryError(res, err.message, "get by id");
        }

        if (!auction) return buildResponse.sendDataNotFound(res);
        await recordAuditTrail("READ", "auctions", auction, req, 'SUCCESS', 'Get Auctions by ID success');
        return buildResponse.findOk(res, auction);
    } catch (err) {
        await recordAuditTrail("READ", "auctions", err, req, 'ERROR', err.message);
        return buildResponse.sendInternalServerError(res, err.message);
    }
};

module.exports = {
    create,
    update,
    remove,
    findAll,
    find,
    findById,
};
