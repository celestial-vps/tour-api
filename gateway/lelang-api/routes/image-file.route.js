const express = require('express');
const multer = require('multer');
const roleGuard = require('../middleware/role-guard');
const sharp = require('sharp');
const path = require('path'); // Make sure to import path
const fs = require('fs');

const imageFileController = require('../controllers/image-file.controller'); // Adjust the path
const router = express.Router();
  

/**
 * @swagger
 * /image-file/upload:
 *   post:
 *     summary: Upload an image file
 *     description: Allows users to upload an image file to the server.
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
 *                 description: The image file to upload.
 *               user:
 *                 type: string
 *                 description: The ID of the user uploading the file.
 *     responses:
 *       200:
 *         description: Successful file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       example: "019223ba-7c2f-76d4-9ad1-2e4b7d2569c2"
 *                     name:
 *                       type: string
 *                       example: "1727176276972-compressed.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40000"
 *                 httpStatus:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid file format"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/upload', roleGuard('Admin'),  imageFileController.create);
router.put('/:oid', roleGuard('Admin'), imageFileController.update);
/**
 * @swagger
 * /image-file/delete/{id}:
 *   delete:
 *     summary: Delete an image file by ID
 *     description: Removes an image file from the server using its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the image file to delete.
 *         schema:
 *           type: string
 *           example: "019227e9-2fca-7809-bd79-e8f1f47a131f"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response indicating the image file was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       example: "019227e9-2fca-7809-bd79-e8f1f47a131f"
 *                     name:
 *                       type: string
 *                       example: "1727246446420-compressed.jpg"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40400"
 *                 httpStatus:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "Image file not found"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete('/delete/:oid', roleGuard('Admin'), imageFileController.deleted);
/**
 * @swagger
 * /image-file:
 *   get:
 *     summary: Retrieve all uploaded image files
 *     description: Fetches a list of all uploaded image files without pagination.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response with the list of image files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         example: "019222ac-0f8c-76f5-a3ae-44d8c30de126"
 *                       fileUrl:
 *                         type: string
 *                         example: "/public/1727158549525-compressed.jpg"
 *                       fileName:
 *                         type: string
 *                         example: "1727158549525-compressed.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-24T06:15:52.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-24T06:15:52.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get('/', roleGuard('Admin'), imageFileController.findAll);
/**
 * @swagger
 * /image-file/q:
 *   get:
 *     summary: Query uploaded image files
 *     description: Retrieves a list of uploaded image files with pagination support.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         required: true
 *         description: The page number to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         description: The number of items to return per page.
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A successful response with the list of image files
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         example: "019222ac-0f8c-76f5-a3ae-44d8c30de126"
 *                       fileUrl:
 *                         type: string
 *                         example: "/public/1727158549525-compressed.jpg"
 *                       fileName:
 *                         type: string
 *                         example: "1727158549525-compressed.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-24T06:15:52.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-24T06:15:52.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.post('/q', roleGuard('Admin'), imageFileController.find);
/**
 * @swagger
 * /image-file/{id}:
 *   get:
 *     summary: Retrieve an uploaded image file
 *     description: Fetches the details of an uploaded image file by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the image file to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful retrieval of the image file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       example: "019223ba-7c2f-76d4-9ad1-2e4b7d2569c2"
 *                     fileUrl:
 *                       type: string
 *                       example: "/public/1727176276972-compressed.jpg"
 *                     fileName:
 *                       type: string
 *                       example: "1727176276972-compressed.jpg"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-24T11:11:17.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-24T11:11:17.000Z"
 *       404:
 *         description: Image file not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40400"
 *                 httpStatus:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "Image file not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get('/:oid', roleGuard('Admin'), imageFileController.findById);

module.exports = router;