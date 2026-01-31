const auctionService = require('../services/auction.service');
const buildResponse = require('../common/build.response');
const { JwtMaker } = require('../middleware/jwt');
const pick = require('../misc/pick');
const { recordAuditTrail } = require('../middleware/audit-trail/with-audit-trail-midleware');


const jwtMaker = new JwtMaker();

const create = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;
        const { auction, error } = await auctionService.create(req.body, userJwt.userOid);

        if (error) {
            await recordAuditTrail("CREATE", "auctions", error, req, 'FAILED', error.message);
            return buildResponse.sendQueryError(res, error.message, "insert");
        }
        await recordAuditTrail("CREATE", "auctions", auction, req, 'SUCCESS', 'Create Auctions success');
        return buildResponse.createOk(res, auction, 1);

    } catch (error) {
        await recordAuditTrail("CREATE", "auctions", error, req, 'ERROR', error.message);
        console.error('Controller Create Error:', error);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const update = async (req, res) => {
    try {
        const userJwt = req.authorization_payload;

        const { auction, error } = await auctionService.update(req.params.oid, req.body, userJwt.userOid);

        if (error) {
            await recordAuditTrail("UPDATE", "auctions", error, req, 'FAILED', error.message);
            return buildResponse.sendQueryError(res, error.message, "update");
        }
        await recordAuditTrail("UPDATE", "auctions", auction, req, 'SUCCESS', 'Update Auctions success');
        return buildResponse.updateOk(res, auction, 1);
    } catch (error) {
        console.error('Controller Update Error:', error);
        await recordAuditTrail("UPDATE", "auctions", error, req, 'ERROR', error.message);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const remove = async (req, res) => {
    try {
        const { auction, error } = await auctionService.deleted(req.params.oid);

        if (error) {
            await recordAuditTrail("DELETE", "auctions", error, req, 'FAILED', error.message);
            return buildResponse.sendQueryError(res, error.message || error, "delete");
        }
        await recordAuditTrail("DELETE", "auctions", auction, req, 'SUCCESS', 'Delete Auctions success');
        return buildResponse.sendDeleteOk(res, auction);
    } catch (error) {
        await recordAuditTrail("DELETE", "auctions", error, req, 'ERROR', error.message);
        console.error('Controller Delete Error:', error);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const findAll = async (req, res) => {
    try {
        const { auctions, error } = await auctionService.findAll();

        if (error) {
            await recordAuditTrail("READ", "auctions", error, req, 'FAILED', error.message);
            return buildResponse.sendQueryError(res, error.message, "get all");
        }
        await recordAuditTrail("READ", "auctions", auctions, req, 'SUCCESS', 'Get all Auctionss success');
        return buildResponse.findOk(res, auctions, auctions.length);
    } catch (error) {
        await recordAuditTrail("READ", "auctions", error, req, 'ERROR', error.message);
        console.error('Controller Find All Error:', error);
        return buildResponse.sendInternalServerError(res, error.message);
    }
};

const find = async (req, res) => {
    try {
        const filters = pick(req.body, ['itemOid', 'search']);

        const options = {
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            pageIndex: parseInt(req.query.pageIndex, 10) || 1,
            pageSize: parseInt(req.query.pageSize, 10) || 10,
        };

        const result = await auctionService.findPage(filters, options);

        if (result.error) {
            await recordAuditTrail("READ", "auctions", result.error, req, 'FAILED', result.error.message);
            return buildResponse.sendInternalServerError(res, result.error.message);
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

        const { auction, error } = await auctionService.findById(req.params.oid, options);

        if (error) {
            await recordAuditTrail("READ", "auctions", error, req, 'FAILED', error.message);
            return buildResponse.sendQueryError(res, error.message, "get by id");
        }

        if (!auction) return buildResponse.sendDataNotFound(res);
        await recordAuditTrail("READ", "auctions", auction, req, 'SUCCESS', 'Get Auctions by ID success');
        return buildResponse.findOk(res, auction);
    } catch (error) {
        await recordAuditTrail("READ", "auctions", error, req, 'ERROR', error.message);
        return buildResponse.sendInternalServerError(res, error.message);
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
