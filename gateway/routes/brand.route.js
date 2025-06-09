// const express = require('express');
// const roleGuard = require('../middleware/role-guard');
// const brandController = require('../controllers/brand.controller'); // Adjust the path

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Brand
//  *     description: Brand management operations
//  */

// /**
//  * @swagger
//  * /brand/create:
//  *   post:
//  *     tags: [Brand]
//  *     summary: Create a new brand entry
//  *     description: Adds a new brand to the database.
//  *     requestBody:
//  *       description: Brand object that needs to be added
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               brandCode:
//  *                 type: string
//  *                 example: B001
//  *               brandName:
//  *                 type: string
//  *                 example: Brand Central Asia
//  *     responses:
//  *       200:
//  *         description: Brand created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "200"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     oid:
//  *                       type: string
//  *                       format: uuid
//  *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
//  *                     brandCode:
//  *                       type: string
//  *                       example: B001
//  *                     brandName:
//  *                       type: string
//  *                       example: Brand Central Asia
//  *                     createdBy:
//  *                       type: string
//  *                       example: test
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-09-18T11:42:10Z"
//  */
// router.post('/create', roleGuard('Admin'), brandController.create);

// /**
//  * @swagger
//  * /brand/{oid}:
//  *   put:
//  *     tags: [Brand]
//  *     summary: Update a brand entry
//  *     description: Updates an existing brand entry in the database.
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         description: The UUID of the brand to update
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *           example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
//  *     requestBody:
//  *       description: Brand object that needs to be updated
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties: 
//  *               brandName:
//  *                 type: string
//  *                 example: Brand Rakyat Indonesia
//  *     responses:
//  *       200:
//  *         description: Brand updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "200"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     oid:
//  *                       type: string
//  *                       format: uuid
//  *                       example: "0192037d-4f4d-76eb-9286-76924e2e6914" 
//  *                     brandName:
//  *                       type: string
//  *                       example: Brand Rakyat Indonesia
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-09-18T11:56:36Z"
//  */
// router.put('/:oid', roleGuard('Admin'), brandController.update);

// /**
//  * @swagger
//  * /brand/delete/{oid}:
//  *   delete:
//  *     tags: [Brand]
//  *     summary: Delete a brand by ID
//  *     description: Removes a brand record from the system using its unique identifier.
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         description: The unique identifier of the brand to delete.
//  *         schema:
//  *           type: string
//  *           example: "01920370-1523-78ec-8a88-9b01fe874882"
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: A successful response indicating the brand was deleted
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     value:
//  *                       type: string
//  *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
//  *                     name:
//  *                       type: string
//  *                       example: "Brand Central Asia"
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40100"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "401"
//  *                 message:
//  *                   type: string
//  *                   example: "Unauthorized"
//  *       404:
//  *         description: Not Found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40400"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "404"
//  *                 message:
//  *                   type: string
//  *                   example: "Brand not found"
//  */
// router.delete('/delete/:oid', roleGuard('Admin'), brandController.deleted);

// /**
//  * @swagger
//  * /brand:
//  *   get:
//  *     tags: [Brand]
//  *     summary: Retrieve all brand entries
//  *     description: Fetches a list of all brands from the database.
//  *     responses:
//  *       200:
//  *         description: A list of brand entries
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "200"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 10
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       oid:
//  *                         type: string
//  *                         format: uuid
//  *                         example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
//  *                       brandName:
//  *                         type: string
//  *                         example: "Brand Of America"
//  *                       createdBy:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       updatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T02:58:52.000Z"
//  */
// router.get('/', roleGuard('Admin'), brandController.findAll);

// /**
//  * @swagger
//  * /brand/q:
//  *   post:
//  *     tags: [Brand]
//  *     summary: Query brand entries with pagination
//  *     description: Retrieves a paginated list of brand entries based on optional filters.
//  *     requestBody:
//  *       description: Filter options for brand query
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               brandName:
//  *                 type: string
//  *                 example: ""
//  *     parameters:
//  *       - name: pageIndex
//  *         in: query
//  *         required: true
//  *         description: The index of the page to retrieve
//  *         schema:
//  *           type: integer
//  *           example: 1
//  *       - name: pageSize
//  *         in: query
//  *         required: true
//  *         description: The number of items to return per page
//  *         schema:
//  *           type: integer
//  *           example: 10
//  *     responses:
//  *       200:
//  *         description: A paginated list of brand entries
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "200"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 9
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       oid:
//  *                         type: string
//  *                         format: uuid
//  *                         example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
//  *                       brandName:
//  *                         type: string
//  *                         example: "Brand Of America"
//  *                       createdBy:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       updatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T02:59:57.000Z"
//  */
// router.post('/q', roleGuard('Admin'), brandController.find);

// /**
//  * @swagger
//  * /brand/{oid}:
//  *   get:
//  *     tags: [Brand]
//  *     summary: Retrieve a brand entry by ID
//  *     description: Fetches details of a specific brand using its UUID.
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         description: The UUID of the brand to retrieve
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *           example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
//  *     responses:
//  *       200:
//  *         description: Brand entry retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "200"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     oid:
//  *                       type: string
//  *                       format: uuid
//  *                       example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
//  *                     brandName:
//  *                       type: string
//  *                       example: "Brand Of America"
//  *                     createdBy:
//  *                       type: string
//  *                       nullable: true
//  *                       example: null
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-09-17T02:59:57.000Z"
//  */
// router.get('/:oid', roleGuard('Admin'), brandController.findById);

// module.exports = router;
