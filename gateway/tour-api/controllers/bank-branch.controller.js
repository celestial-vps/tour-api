// // controllers/bankBranchController.js
// const bankBranchService = require('../services/bank-branch.service');
// const buildBesponse = require('../common/build.response');
// const validateRequest = require('../misc/validation');
// const { createBankBranchDto, updateBankBranchDto, filterBankBranchDto, params, querySchema } = require('../dtos/payload-bank-branch-dto');
// const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
// const jwtMaker = new JwtMaker();
// const pick = require('../misc/pick')

// const DEFAULT_PAGE = 1;
// const DEFAULT_PAGE_SIZE = 10;
// const MAX_PAGE_SIZE = 100;

// const create = async (req, res) => {
//     try {
//         const userJwt = req.authorization_payload;
//         const { bankBranch, err } = await bankBranchService.create(req.body, userJwt.userOid);

//         let response;

//         if (err !== null) {
//             response = buildBesponse.responseErrorInserted(err.message);
//             return res.status(400).json(response); // ✅ Proper status code for validation error
//         }

//         response = buildBesponse.responseOk(bankBranch, 1);
//         return res.status(201).json(response); // ✅ Proper status code for success
//     } catch (err) {
//         const response = buildBesponse.responseInternalServerError(err.message);
//         return res.status(500).json(response); // ✅ Keep this as is
//     }
// };


// const update = async (req, res) => {
// 	try {
// 		const userJwt = req.authorization_payload;

// 		const { bankBranch, err } = await bankBranchService.update(req.params.oid, req.body, userJwt.userOid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorUpdate(err.message)
// 		} else {
// 			response = buildBesponse.responseOk(bankBranch, 1)
// 		}
// 		res.status(201).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const deleted = async (req, res) => {
// 	try {
//  		const { bankBranch, err } = await bankBranchService.deleted(req.params.oid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorDelete(err.message === undefined ? err : err.message)
// 		} else {
// 			response = buildBesponse.responseDeleteOk(bankBranch)

// 		}
// 		res.status(201).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const findAll = async (req, res) => {
// 	try {
// 		const { bankBranchs, err } = await bankBranchService.findAll();
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorGet(err.message)
// 		} else {
// 			response = buildBesponse.responseOk(bankBranchs, bankBranchs.length)
// 		}
// 		res.status(200).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const find = async (req, res) => {

// 	try {
// 		const options = pick(req.query, ['sortBy', 'fieldName', 'sortOrder', 'pageSize', 'pageIndex']);
// 		const filters = pick(req.body, ['bankBranchCode', 'bankBranchName']);

// 		// Set default values
// 		const pageIndex = parseInt(options.pageIndex) || 1;
// 		const pageSize = parseInt(options.pageSize) || 10;

// 		const { countries, count } = await bankBranchService.findPage(filters, options);

// 		response = buildBesponse.responsePaggination(countries, count, pageIndex, pageSize)
// 		res.status(200).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const findById = async (req, res) => {
// 	try {
 
// 		const { bankBranch, err } = await bankBranchService.findById(req.params.oid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorGet(err.message)
// 			return res.status(200).json(response);
// 		}

// 		if (bankBranch) {
// 			response = buildBesponse.responseOk(bankBranch, 1)
// 			return res.status(200).json(response);
// 		} else {
// 			response = buildBesponse.responseDataNotFound("")
// 			return res.status(404).json(response);
// 		}
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };
 

// module.exports = {
// 	create,
// 	update,
// 	deleted,
// 	findAll,
// 	findById,
// 	find,
// };
