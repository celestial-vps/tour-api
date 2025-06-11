// const conversationMemberService = require('../gateway/services/conversation-member.service');
// const buildResponse = require('../common/build.response');
// const { JwtMaker } = require('../middleware/jwt');
// const pick = require('../misc/pick');

// const jwtMaker = new JwtMaker();

// const create = async (req, res) => {
// 	try {
// 		const userJwt = req.authorization_payload;
// 		const { conversationMember, err } = await conversationMemberService.create(req.body);

// 		if (err) {
// 			return buildResponse.sendQueryError(res, err.message, "insert");
// 		}

// 		return buildResponse.createOk(res, conversationMember, 1);
// 	} catch (err) {
// 		console.error('Controller Create Error:', err);
// 		return buildResponse.sendInternalServerError(res, err.message);
// 	}
// };

// const remove  = async (req, res) => {
// 	try {
// 		const { conversationMember, err } = await conversationMemberService.deleted(req.params.oid);

// 		if (err) {
// 			return buildResponse.sendQueryError(res, err.message || err, "delete");
// 		}

// 		return buildResponse.sendDeleteOk(res, conversationMember);
// 	} catch (err) {
// 		console.error('Controller Delete Error:', err); 
// 		return buildResponse.sendInternalServerError(res, err.message);
// 	}
// };

// const findAll = async (req, res) => {
// 	try {
// 		const { conversationMembers, err } = await conversationMemberService.findAll();

// 		if (err) {
// 			return buildResponse.sendQueryError(res, err.message, "get all");
// 		}

// 		return buildResponse.findOk(res, conversationMembers, conversationMembers.length);
// 	} catch (err) {
// 		return buildResponse.sendInternalServerError(res, err.message);
// 	}
// };

// const find = async (req, res) => {
//   try {
//     const filters = pick(req.body, ['conversationOid', 'userOid']);

//     const options = {
//       sortBy: req.query.sortBy,
//       sortOrder: req.query.sortOrder,
//       pageIndex: parseInt(req.query.pageIndex, 10) || 1,
//       pageSize: parseInt(req.query.pageSize, 10) || 10,
//     };

//     const result = await conversationMemberService.findPage(filters, options);

//     if (result.err) {
//       return buildResponse.sendInternalServerError(res, result.err.message);
//     }

//     return buildResponse.sendPagination(res, result.conversationMembers, result.count, options.pageIndex, options.pageSize);
//   } catch (error) {
//     console.error('Controller error:', error);
//     return buildResponse.sendInternalServerError(res, error.message);
//   }
// };

// const findById = async (req, res) => {
// 	try {
// 		const options = {
// 			include: [],
// 		};

// 		const { conversationMember, err } = await conversationMemberService.findById(req.params.oid, options);

// 		if (err) {
// 			return buildResponse.sendQueryError(res, err.message, "get by id");
// 		}

// 		if (!conversationMember) return buildResponse.sendDataNotFound(res);

// 		return buildResponse.findOk(res, conversationMember);
// 	} catch (err) {
// 		return buildResponse.sendInternalServerError(res, err.message);
// 	}
// };

// module.exports = {
// 	create,
// 	remove,
// 	findAll,
// 	find,
// 	findById,
// };
