// const brandService = require('../services/brand.service');
// const buildBesponse = require('../common/build.response');
// const validateRequest = require('../misc/validation');
// const { createBrandDto, updateBrandDto,filterBrandDto,params,querySchema } = require('../dtos/payload-brand-dto');
// const { JwtMaker } = require('../middleware/jwt'); 
// const jwtMaker = new JwtMaker();


// const create = async (req, res) => {
// 	try {
// 		const token = req.headers['authorization'];		
// 		const accessToken = token.split(' ')[1]; 
// 		const { isValid, message } = validateRequest(null, createBrandDto, null,req, true);
// 		if (!isValid) {
// 			const response = buildBesponse.responseFinValidatorError(message);
// 			return res.status(400).json(response);
// 		}

// 		const { brand, err } = await brandService.create(req.body,userJwt.userOid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorInserted(err.message)
// 		} else {
// 			response = buildBesponse.responseOk(brand, 1)
// 		}

// 		res.status(201).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const update = async (req, res) => {
// 	try {
// 		const token = req.headers['authorization'];		
// 		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
// 		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise


// 		const { isValid, message } = validateRequest(params, updateBrandDto,null, req, true);
// 		if (!isValid) {
// 			const response = buildBesponse.responseFinValidatorError(message);
// 			return res.status(400).json(response); // Return 400 Bad Request for validation errors
// 		}

// 		const { brand, err } = await brandService.update(req.params.oid, req.body,userJwt.userOid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorUpdate(err.message)
// 		} else {
// 			response = buildBesponse.responseOk(brand, 1)
// 		}
// 		res.status(201).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const deleted = async (req, res) => {
// 	try {
// 		const { isValid, message } = validateRequest(params, null,null, req, true);
// 		if (!isValid) {
// 			const response = buildBesponse.responseFinValidatorError(message);
// 			return res.status(400).json(response); // Return 400 Bad Request for validation errors
// 		}

// 		const {brand,err} = await brandService.deleted(req.params.oid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorDelete(err.message === undefined ? err : err.message)
// 		} else {
// 			response = buildBesponse.responseDeleteOk(brand)

// 		}
// 		res.status(201).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const findAll = async (req, res) => {
// 	try {
// 		const { brands, err } = await brandService.findAll();
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorGet(err.message)
// 		} else {
// 			response = buildBesponse.responseOk(brands, brands.length)
// 		}
// 		res.status(200).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const find = async (req, res) => {
// 	const pageIndexStr = req.query.pageIndex;
// 	const pageSizeStr = req.query.pageSize;
// 	const brandDto = req.body;  // Assuming request body contains the filter details
// 	let pageIndex = 0;
// 	let pageSize = 10;

// 	try {
// 		const { isValid, message } = validateRequest(null, filterBrandDto,querySchema, req, true);
// 		if (!isValid) {
// 			const response = buildBesponse.responseFinValidatorError(message);
// 			return res.status(400).json(response); // Return 400 Bad Request for validation errors
// 		}

// 		if (pageIndexStr) {
// 			pageIndex = parseInt(pageIndexStr, 10);
// 			if (isNaN(pageIndex)) {
// 				return res.status(400).json(common.responseForbidden('Invalid pageIndex format'));
// 			}
// 		}

// 		if (pageSizeStr) {
// 			pageSize = parseInt(pageSizeStr, 10);
// 			if (isNaN(pageSize)) {
// 				return res.status(400).json(common.responseForbidden('Invalid pageSize format'));
// 			}
// 		}
// 		const condition = {
// 			brandCode: brandDto.brandCode,
// 			brandName: brandDto.brandName
// 		};

// 		const { brands, count } = await brandService.findPage(condition, pageIndex, pageSize);
// 		response = buildBesponse.responseOk(brands, count)
// 		res.status(200).json(response);
// 	} catch (err) {
// 		response = buildBesponse.responseInternalServerError(err.message)
// 		res.status(500).json(response);
// 	}
// };

// const findById = async (req, res) => {
// 	try {
// 		const { isValid, message } = validateRequest(params, null, null, req, true);
// 		if (!isValid) {
// 			const response = buildBesponse.responseFinValidatorError(message);
// 			return res.status(400).json(response); // Return 400 Bad Request for validation errors
// 		}
		
// 		const { brand, err } = await brandService.findById(req.params.oid);
// 		if (err !== null) {
// 			response = buildBesponse.responseErrorGet(err.message)
// 			return res.status(200).json(response);
// 		}

// 		if (brand) {
// 			response = buildBesponse.responseOk(brand, 1)
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
