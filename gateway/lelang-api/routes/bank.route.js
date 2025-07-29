const express = require('express');
const bankController = require('../controllers/bank.controller'); // Adjust the path as needed
const roleGuard = require('../middleware/role-guard');
const router = express.Router();


/**
 * @swagger
 * /bank/create:
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   post:
 *     summary: Create a new bank entry
 *     description: Adds a new bank to the database.
 *     requestBody:
 *       description: Bank object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankCode:
 *                 type: string
 *                 example: B001
 *               bankName:
 *                 type: string
 *                 example: Bank Central Asia
 *               shortName:
 *                 type: string
 *                 example: BCA
 *     responses:
 *       200:
 *         description: Bank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
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
 *                       format: uuid
 *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
 *                     bankCode:
 *                       type: string
 *                       example: B001
 *                     bankName:
 *                       type: string
 *                       example: Bank Central Asia
 *                     shortName:
 *                       type: string
 *                       example: BCA
 *                     createdBy:
 *                       type: string
 *                       example: test
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-18T11:42:10Z"
 */ 
router.post('/create', roleGuard('Admin'), bankController.create);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /bank/{oid}:
 *   put:
 *     summary: Update a bank entry
 *     description: Updates an existing bank entry in the database.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the bank to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
 *     requestBody:
 *       description: Bank object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankCode:
 *                 type: string
 *                 example: B002
 *               bankName:
 *                 type: string
 *                 example: Bank Rakyat Indonesia
 *               shortName:
 *                 type: string
 *                 example: BRI
 *     responses:
 *       200:
 *         description: Bank updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
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
 *                       format: uuid
 *                       example: "0192037d-4f4d-76eb-9286-76924e2e6914"
 *                     bankCode:
 *                       type: string
 *                       example: B002
 *                     bankName:
 *                       type: string
 *                       example: Bank Rakyat Indonesia
 *                     shortName:
 *                       type: string
 *                       example: BRI
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-18T11:56:36Z"
 */
router.put('/:oid', roleGuard('Admin'), bankController.update);
/**
 * @swagger
 * /bank/delete/{id}:
 *   delete:
 *     summary: Delete a bank by ID
 *     description: Removes a bank record from the system using its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the bank to delete.
 *         schema:
 *           type: string
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response indicating the bank was deleted
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
 *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
 *                     name:
 *                       type: string
 *                       example: "Bank Central Asia"
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
 *                   example: "Bank not found"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete('/delete/:oid', roleGuard('Admin'), bankController.remove);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /bank:
 *   get:
 *     summary: Retrieve all bank entries
 *     description: Fetches a list of all banks from the database.
 *     responses:
 *       200:
 *         description: A list of bank entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
 *                       bankCode:
 *                         type: string
 *                         example: "B022"
 *                       bankName:
 *                         type: string
 *                         example: "Bank Of America"
 *                       shortName:
 *                         type: string
 *                         example: "BcA"
 *                       createdBy:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T02:58:52.000Z"
 */
router.get('/', roleGuard('Admin'), bankController.findAll);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /bank/q:
 *   post:
 *     summary: Query bank entries with pagination
 *     description: Retrieves a paginated list of bank entries based on optional filters.
 *     requestBody:
 *       description: Filter options for bank query
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankCode:
 *                 type: string
 *                 example: ""
 *               bankName:
 *                 type: string
 *                 example: ""
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         description: The index of the page to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         description: The number of items to return per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of bank entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 9
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *                       bankCode:
 *                         type: string
 *                         example: "B023"
 *                       bankName:
 *                         type: string
 *                         example: "Bank Of America"
 *                       shortName:
 *                         type: string
 *                         example: "BcA"
 *                       createdBy:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T02:59:57.000Z"
 */
router.post('/q', roleGuard('Admin'), bankController.find);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /bank/{oid}:
 *   get:
 *     summary: Retrieve a bank entry by ID
 *     description: Fetches details of a specific bank using its UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the bank to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *     responses:
 *       200:
 *         description: Bank entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
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
 *                       format: uuid
 *                       example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *                     bankCode:
 *                       type: string
 *                       example: "B023"
 *                     bankName:
 *                       type: string
 *                       example: "Bank Of America"
 *                     shortName:
 *                       type: string
 *                       example: "BcA"
 *                     createdBy:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-17T02:59:57.000Z"
 */
router.get('/:oid', roleGuard('Admin'), bankController.findById);

module.exports = router;