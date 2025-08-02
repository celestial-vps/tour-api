const express = require('express');
const itemCategoryController = require('../controllers/item-category.controller'); // Adjust the path as needed
const roleGuard = require('../middleware/role-guard');
const router = express.Router();


/**
 * @swagger
 * /itemCategory/create:
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   post:
 *     summary: Create a new itemCategory entry
 *     description: Adds a new itemCategory to the database.
 *     requestBody:
 *       description: ItemCategory object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: B001
 *               description:
 *                 type: string
 *                 example: ItemCategory Central Asia
 *               imageOid:
 *                 type: string
 *                 example: BCA
 *     responses:
 *       200:
 *         description: ItemCategory created successfully
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
 *                     title:
 *                       type: string
 *                       example: B001
 *                     description:
 *                       type: string
 *                       example: ItemCategory Central Asia
 *                     imageOid:
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
router.post('/create', roleGuard('Admin'), itemCategoryController.create);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /itemCategory/{oid}:
 *   put:
 *     summary: Update a itemCategory entry
 *     description: Updates an existing itemCategory entry in the database.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the itemCategory to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
 *     requestBody:
 *       description: ItemCategory object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: B002
 *               description:
 *                 type: string
 *                 example: ItemCategory Rakyat Indonesia
 *               imageOid:
 *                 type: string
 *                 example: BRI
 *     responses:
 *       200:
 *         description: ItemCategory updated successfully
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
 *                     title:
 *                       type: string
 *                       example: B002
 *                     description:
 *                       type: string
 *                       example: ItemCategory Rakyat Indonesia
 *                     imageOid:
 *                       type: string
 *                       example: BRI
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-18T11:56:36Z"
 */
router.put('/:oid', roleGuard('Admin'), itemCategoryController.update);
/**
 * @swagger
 * /itemCategory/delete/{id}:
 *   delete:
 *     summary: Delete a itemCategory by ID
 *     description: Removes a itemCategory record from the system using its unique identifier.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the itemCategory to delete.
 *         schema:
 *           type: string
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response indicating the itemCategory was deleted
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
 *                       example: "ItemCategory Central Asia"
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
 *                   example: "ItemCategory not found"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete('/delete/:oid', roleGuard('Admin'), itemCategoryController.remove);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /itemCategory:
 *   get:
 *     summary: Retrieve all itemCategory entries
 *     description: Fetches a list of all itemCategorys from the database.
 *     responses:
 *       200:
 *         description: A list of itemCategory entries
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
 *                   itemCategorys:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
 *                       title:
 *                         type: string
 *                         example: "B022"
 *                       description:
 *                         type: string
 *                         example: "ItemCategory Of America"
 *                       imageOid:
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
router.get('/', roleGuard('Admin'), itemCategoryController.findAll);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /itemCategory/q:
 *   post:
 *     summary: Query itemCategory entries with pagination
 *     description: Retrieves a paginated list of itemCategory entries based on optional filters.
 *     requestBody:
 *       description: Filter options for itemCategory query
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: ""
 *               description:
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
 *         description: The number of itemCategorys to return per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of itemCategory entries
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
 *                   itemCategorys:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *                       title:
 *                         type: string
 *                         example: "B023"
 *                       description:
 *                         type: string
 *                         example: "ItemCategory Of America"
 *                       imageOid:
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
router.post('/q', roleGuard('Admin'), itemCategoryController.find);
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /itemCategory/{oid}:
 *   get:
 *     summary: Retrieve a itemCategory entry by ID
 *     description: Fetches details of a specific itemCategory using its UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the itemCategory to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *     responses:
 *       200:
 *         description: ItemCategory entry retrieved successfully
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
 *                     title:
 *                       type: string
 *                       example: "B023"
 *                     description:
 *                       type: string
 *                       example: "ItemCategory Of America"
 *                     imageOid:
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
router.get('/:oid', roleGuard('Admin'), itemCategoryController.findById);

module.exports = router;