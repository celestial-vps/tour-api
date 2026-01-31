const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = require('../config/multer-storage');
const imageFileController = require('../controllers/image-file.controller'); 
const { jwtAuthMiddleware } = require('../middleware/jwt-auth-middleware');
// const upload = multer({ storage });
const upload = require('../config/multer-storage'); // Import the multer configuration
/**
 * @swagger
 * /image-file/upload:
 *   post:
 *     summary: Upload a single image file
 *     tags:
 *       - Image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 oid:
 *                   type: string
 *                   format: uuid
 *                   description: ID of the uploaded image
 *                 fileName:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *                   description: URL to access the uploaded image
 *       400:
 *         description: Bad request, e.g. no file or invalid file
 *       500:
 *         description: Server error
 */
 router.post('/upload', upload.single('image'), imageFileController.uploadImage);
//  router.post('/upload',jwtAuthMiddleware, upload.single('image'), imageFileController.uploadImage);
router.get('/:oid', imageFileController.getImageMetadata);
router.get('/:oid/view', imageFileController.viewImage);
router.delete('/:oid', imageFileController.remove);

module.exports = router;
