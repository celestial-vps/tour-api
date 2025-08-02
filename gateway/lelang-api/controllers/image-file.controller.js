// controllers/imageFileController.js
const imageFileService = require('../services/image-file.service');
const { responseFinValidatorError, responseErrorInserted, responseOk, responseInternalServerError, responseDeleteOk, responseDataNotFound, responseErrorGet } = require('../common/build.response');
const validateRequest = require('../misc/validation');
const { createImageFileDto, updateImageFileDto, filterImageFileDto ,params, querySchema} = require('../dtos/payload-image-file-dto');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { JwtMaker } = require('../middleware/jwt'); // Adjust the path accordingly
const jwtMaker = new JwtMaker();
const buildBesponse = require('../common/build.response');

const uploadsDir = path.join(__dirname, '../public');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir);
}

const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname).toLowerCase();
		if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
			cb(null, true);
		} else {
			cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
		}
	},
}).single('image');

const create = async (req, res) => {
	  upload(req, res, async (err) => {
		if (err) {
			return res.status(400).send(err.message);
		}

		if (!req.file) {
			return res.status(400).send('No file uploaded.');
		}

		const fileName = `${Date.now()}-compressed${path.extname(req.file.originalname)}`;
		const filePath = path.join(uploadsDir, fileName);
		const fileMime = req.file.mimetype;

		try {
			const token = req.headers['authorization'];
			const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
			const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

			await sharp(req.file.buffer)
				.resize(800) // Resize if needed
				.toFormat('jpeg', { quality: 80 }) // Convert to JPEG and set quality
				.toFile(filePath); // Save to file

			// const fileUrl = `/public/${fileName}`; // URL to access the file
			const fileUrl = `${fileName}`; // URL to access the file

			// Create DTO object
			createImageFileDto.fileName = fileName;
			createImageFileDto.fileUrl = fileUrl;
			createImageFileDto.filePath = filePath;
			createImageFileDto.fileMime = fileMime;			
			createImageFileDto.description = null;

			// Validate request
			// const { isValid, message } = validateRequest(null, createImageFileDto, null , req, true);
			// if (!isValid) {
			// 	const response = responseFinValidatorError(message);
			// 	return res.status(400).json(response); // Return 400 Bad Request for validation errors
			// }

			// Call service to create the image file record
			const { imageFile, err } = await imageFileService.create(createImageFileDto,userJwt.userOid);
			if (err) {
				const response = buildBesponse.responseError(err.httpStatus);
				return res.status(500).json(response); // Return 500 for internal errors
			}

			const response = responseOk(imageFile, 1);
			res.status(201).json(response);
		} catch (error) {
			const response = responseInternalServerError(error.message);
			res.status(500).json(response);
		}
	});
};


const update = async (req, res) => {
	try {
		const token = req.headers['authorization'];
		const accessToken = token.split(' ')[1]; // Assuming "Bearer <token>" 
		const userJwt = await jwtMaker.getClaimsByOid(accessToken); // Await the promise

		const { isValid, message } = validateRequest(params, updateImageFileDto, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { imageFile, err } = await imageFileService.update(req.params.oid, req.body,userJwt.userOid);
		if (err !== null) {
			response = buildBesponse.responseError(err.httpStatus)
		} else {
			response = responseOk(imageFile, 1)
		}

		res.status(201).json(response);
	} catch (err) {
		response = responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const deleted = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { imageFile, err } = await imageFileService.deleted(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseError(err.httpStatus)
		} else {
			response = responseDeleteOk(imageFile)
		}

		res.status(201).json(response);
	} catch (err) {
		response = responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findAll = async (req, res) => {
	try {
		const { imageFiles, err } = await imageFileService.findAll();
		if (err !== null) {
			response = buildBesponse.responseError(err.httpStatus)
		} else {
			response = responseOk(imageFiles, imageFiles.length)
		}
		res.status(200).json(response);
	} catch (err) {
		response = responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};

const findById = async (req, res) => {
	try {
		const { isValid, message } = validateRequest(params, null, null, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		const { imageFile, err } = await imageFileService.findById(req.params.oid);
		if (err !== null) {
			response = buildBesponse.responseError(err.httpStatus)
		}else if (imageFile === null) {
			response = responseDataNotFound(err.message)
		} else {
			response = responseOk(imageFile, 1)
		}

		res.status(201).json(response);
	} catch (err) {
		response = responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};
const find = async (req, res) => {
	const pageIndexStr = req.query.pageIndex;
	const pageSizeStr = req.query.pageSize;
	const imageFileDto = req.body;  // Assuming request body contains the filter details
	let pageIndex = 0;
	let pageSize = 10;

	try {
		const { isValid, message } = validateRequest(null, filterImageFileDto, querySchema, req, true);
		if (!isValid) {
			const response = responseFinValidatorError(message);
			return res.status(400).json(response); // Return 400 Bad Request for validation errors
		}

		if (pageIndexStr) {
			pageIndex = parseInt(pageIndexStr, 10);
			if (isNaN(pageIndex)) {
				return res.status(400).json(common.responseForbidden('Invalid pageIndex format'));
			}
		}

		if (pageSizeStr) {
			pageSize = parseInt(pageSizeStr, 10);
			if (isNaN(pageSize)) {
				return res.status(400).json(common.responseForbidden('Invalid pageSize format'));
			}
		}
		const condition = {
			fileName: imageFileDto.fileName			
		};

		const { imageFiles, count } = await imageFileService.findPage(condition, pageIndex, pageSize);
		const totalPage = Math.ceil(count / pageSize);
		const pagging = {
			page: pageIndex,
			size: pageSize,
			totalItem: count,
			totalPage: totalPage, // Correctly calculates total pages			
		};
		response = buildBesponse.ResponseOkWithPaggination(imageFiles,pagging )
		res.status(200).json(response);
	} catch (err) {
		response = responseInternalServerError(err.message)
		res.status(500).json(response);
	}
};


module.exports = {
	create,
	update,
	deleted,
	findAll,
	findById,
	find,
};