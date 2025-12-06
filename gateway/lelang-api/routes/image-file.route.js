const express = require('express');
const multer = require('multer');
const {roleGuard} = require('../middleware/role-guard');
const imageFileController = require('../controllers/image-file.controller');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Image File
 *     description: Image file management
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ImageFile:
 *       type: object
 *       properties:
 *         oid:
 *           type: string
 *           format: uuid
 *         fileUrl:
 *           type: string
 *         fileName:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ImageFileUploadDto:
 *       type: object
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *         user:
 *           type: string
 *     ApiResponse:
 *       type: object
 *       properties:
 *         resultCode:
 *           type: string
 *         httpStatus:
 *           type: string
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/ImageFile'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/ImageFile'
 */

/**
 * @swagger
 * /image-file/upload:
 *   post:
 *     tags: [ImageFile]
 *     summary: Upload an image file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ImageFileUploadDto'
 *     responses:
 *       200:
 *         description: Successful file upload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/upload', roleGuard('Admin'), imageFileController.create);

router.put('/:oid', roleGuard('Admin'), imageFileController.update);

/**
 * @swagger
 * /image-file/delete/{oid}:
 *   delete:
 *     tags: [ImageFile]
 *     summary: Delete an image file by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successful deletion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/delete/:oid', roleGuard('Admin'), imageFileController.deleted);

/**
 * @swagger
 * /image-file:
 *   get:
 *     tags: [ImageFile]
 *     summary: Retrieve all uploaded image files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of image files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', roleGuard('Admin'), imageFileController.findAll);

/**
 * @swagger
 * /image-file/q:
 *   get:
 *     tags: [ImageFile]
 *     summary: Query uploaded image files with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Paginated list of image files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/q', roleGuard('Admin'), imageFileController.find);

/**
 * @swagger
 * /image-file/{oid}:
 *   get:
 *     tags: [ImageFile]
 *     summary: Retrieve an image file by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Image file retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:oid', roleGuard('Admin'), imageFileController.findById);

module.exports = router;
