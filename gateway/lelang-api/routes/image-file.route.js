const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const imageFileController = require('../controllers/image-file.controller');
const { 
  createImageFileDto,
  updateImageFileDto,
  filterImageFileDto,
  params,
  imageFileResponseDto
} = require('../dtos/payload-image-file-dto');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');
const Joi = require('joi');
const { successResponse, errorResponse } = require('../dtos/response.dto');
const { messageDto } = require('../dtos/message-dto');

const router = express.Router();

// ---- Convert Joi to Swagger ----
const { swagger: CreateImageFilePayloadSchema } = j2s(createImageFileDto);
const { swagger: UpdateImageFilePayloadSchema } = j2s(updateImageFileDto);
const { swagger: DeleteImageFilePayloadSchema } = j2s(params);
const { swagger: FilterImageFilePayloadSchema } = j2s(filterImageFileDto);
const { swagger: ImageFileSuccessSchema } = j2s(successResponse(imageFileResponseDto));
const { swagger: ImageFileListSuccessSchema } = j2s(
  successResponse(Joi.array().items(imageFileResponseDto))
);
const { swagger: ImageFileSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register global swagger components ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateImageFilePayloadDto = CreateImageFilePayloadSchema;
global.swaggerComponents.UpdateImageFilePayloadDto = UpdateImageFilePayloadSchema;
global.swaggerComponents.DeleteImageFilePayloadDto = DeleteImageFilePayloadSchema;
global.swaggerComponents.FilterImageFilePayloadDto = FilterImageFilePayloadSchema;
global.swaggerComponents.ImageFileSuccessResponse = ImageFileSuccessSchema;
global.swaggerComponents.ImageFileListSuccessResponse = ImageFileListSuccessSchema;
global.swaggerComponents.ImageFileSuccessCRUDResponse = ImageFileSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

// ---------------- Routes ----------------

/**
 * @openapi
 * /image-file/upload:
 *   post:
 *     tags:
 *       - ImageFile
 *     summary: Upload an image file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/upload', roleGuard('Admin'), imageFileController.create);

/**
 * @openapi
 * /image-file/{oid}:
 *   put:
 *     tags:
 *       - Image File
 *     summary: Update an image file
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateImageFilePayloadDto"
 *     responses:
 *       200:
 *         description: Image file updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:oid', validateRequest(updateImageFileDto), roleGuard('Admin'), imageFileController.update);

/**
 * @openapi
 * /image-file/delete/{oid}:
 *   delete:
 *     tags:
 *       - Image File
 *     summary: Delete an image file by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/delete/:oid', validateRequest(params), roleGuard('Admin'), imageFileController.deleted);

/**
 * @openapi
 * /image-file:
 *   get:
 *     tags:
 *       - Image File
 *     summary: Get all image files
 *     responses:
 *       200:
 *         description: List of image files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/', roleGuard('Admin'), imageFileController.findAll);

/**
 * @openapi
 * /image-file/q:
 *   post:
 *     tags:
 *       - Image File
 *     summary: Paginated or filtered image files
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterImageFilePayloadDto"
 *     responses:
 *       200:
 *         description: Paginated list of image files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/q', validateRequest(filterImageFileDto), roleGuard('Admin'), imageFileController.find);

/**
 * @openapi
 * /image-file/{oid}:
 *   get:
 *     tags:
 *       - Image File
 *     summary: Get image file by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image file retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImageFileSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:oid', validateRequest(params), roleGuard('Admin'), imageFileController.findById);

module.exports = router;
