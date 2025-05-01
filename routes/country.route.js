const express = require('express');
const roleGuard = require('../middleware/role-guard');
const countryController = require('../controllers/country.controller'); // Adjust the path
const { validateRequest } = require('../misc/validation');
const { createCountryDto, updateCountryDto, filterCountryDto, params, querySchema } = require('../dtos/payload-country-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Country
 *     description: Country management operations
 */

/**
 * @swagger
 * /country/create:
 *   post:
 *     tags: [Country]
 *     summary: Create a new country entry
 *     description: Adds a new country to the database.
 *     requestBody:
 *       description: Country object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: B001
 *               countryName:
 *                 type: string
 *                 example: Country Central Asia
 *     responses:
 *       200:
 *         description: Country created successfully
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
 *                     countryCode:
 *                       type: string
 *                       example: B001
 *                     countryName:
 *                       type: string
 *                       example: Country Central Asia
 *                     createdBy:
 *                       type: string
 *                       example: test
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-18T11:42:10Z"
 */
router.post('/create', roleGuard('Admin'), countryController.create);

/**
 * @swagger
 * /country/{oid}:
 *   put:
 *     tags: [Country]
 *     summary: Update a country entry
 *     description: Updates an existing country entry in the database.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the country to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdeb-12a0-7fa6-916b-b7105b043c3c"
 *     requestBody:
 *       description: Country object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               countryName:
 *                 type: string
 *                 example: Country Rakyat Indonesia
 *     responses:
 *       200:
 *         description: Country updated successfully
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
 *                     countryName:
 *                       type: string
 *                       example: Country Rakyat Indonesia
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-18T11:56:36Z"
 */
router.put('/:oid', roleGuard('Admin'), countryController.update);

/**
 * @swagger
 * /country/delete/{oid}:
 *   delete:
 *     tags: [Country]
 *     summary: Delete a country by ID
 *     description: Removes a country record from the system using its unique identifier.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The unique identifier of the country to delete.
 *         schema:
 *           type: string
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A successful response indicating the country was deleted
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
 *                       example: "Country Central Asia"
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
 *                   example: "Country not found"
 */
router.delete('/delete/:oid', roleGuard('Admin'), countryController.deleted);

/**
 * @swagger
 * /country:
 *   get:
 *     tags: [Country]
 *     summary: Retrieve all country entries
 *     description: Fetches a list of all countrys from the database.
 *     responses:
 *       200:
 *         description: A list of country entries
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
 *                       countryName:
 *                         type: string
 *                         example: "Country Of America"
 *                       createdBy:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T02:58:52.000Z"
 */
router.get('/', roleGuard('Admin'), countryController.findAll);

/**
 * @swagger
 * /country/q:
 *   post:
 *     tags: [Country]
 *     summary: Query country entries with pagination
 *     description: Retrieves a paginated list of country entries based on optional filters.
 *     requestBody:
 *       description: Filter options for country query
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryName:
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
 *         description: A paginated list of country entries
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
 *                       countryName:
 *                         type: string
 *                         example: "Country Of America"
 *                       createdBy:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T02:59:57.000Z"
 */
router.post('/q', validateRequest(filterCountryDto), roleGuard('Admin'), countryController.find);
// router.post('/q', roleGuard('Admin'),validateRequest(null, filterCountryDto,querySchema,  true), countryController.find);

/**
 * @swagger
 * /country/{oid}:
 *   get:
 *     tags: [Country]
 *     summary: Retrieve a country entry by ID
 *     description: Fetches details of a specific country using its UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the country to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "0191fdec-002f-7420-9d99-9dd58fbb9185"
 *     responses:
 *       200:
 *         description: Country entry retrieved successfully
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
 *                     countryName:
 *                       type: string
 *                       example: "Country Of America"
 *                     createdBy:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-17T02:59:57.000Z"
 */
router.get('/:oid', roleGuard('Admin'), countryController.findById);

module.exports = router;
