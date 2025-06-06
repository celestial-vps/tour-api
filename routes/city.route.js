const express = require('express');
const cityController = require('../controllers/city.controller');
const { validateRequest } = require('../misc/validation');
const { roleGuard } = require('../middleware/role-guard');
const {
  createCityRequestDto,
  updateCityRequestDto,
  deleteCityDto,
  getCityDto,
  filterCityDto
} = require('../dtos/city.dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: City
 *     description: City management operations
 */

/**
 * @swagger
 * /city/create:
 *   post:
 *     tags: [City]
 *     summary: Create a new city entry
 *     description: Adds a new city to the database.
 *     requestBody:
 *       description: City object to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provinceOid:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               cityName:
 *                 type: string
 *                 example: "Jakarta"
 *     responses:
 *       200:
 *         description: City created successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *                     provinceOid:
 *                       type: string
 *                       format: uuid
 *                       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     cityName:
 *                       type: string
 *                       example: "Jakarta"
 */
router.post('/create', validateRequest(createCityRequestDto), roleGuard('Admin'), cityController.create);

/**
 * @swagger
 * /city/{oid}:
 *   put:
 *     tags: [City]
 *     summary: Update a city entry
 *     description: Updates an existing city entry in the database.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the city to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *     requestBody:
 *       description: City object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provinceOid:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               cityName:
 *                 type: string
 *                 example: "Bandung"
 *     responses:
 *       200:
 *         description: City updated successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *                     provinceOid:
 *                       type: string
 *                       format: uuid
 *                       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     cityName:
 *                       type: string
 *                       example: "Bandung"
 */
router.put('/:oid', validateRequest(updateCityRequestDto), roleGuard('Admin'), cityController.update);

/**
 * @swagger
 * /city/delete/{oid}:
 *   delete:
 *     tags: [City]
 *     summary: Delete a city by ID
 *     description: Removes a city record from the system using its unique identifier.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The unique identifier of the city to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *     responses:
 *       200:
 *         description: City deleted successfully
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
 */
router.delete('/delete/:oid', validateRequest(deleteCityDto), roleGuard('Admin'), cityController.delete);

/**
 * @swagger
 * /city/{oid}:
 *   get:
 *     tags: [City]
 *     summary: Retrieve a city entry by ID
 *     description: Fetches details of a specific city using its UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: The UUID of the city to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *     responses:
 *       200:
 *         description: City retrieved successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *                     provinceOid:
 *                       type: string
 *                       format: uuid
 *                       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     cityName:
 *                       type: string
 *                       example: "Jakarta"
 */
router.get('/:oid', validateRequest(getCityDto), roleGuard('Admin'), cityController.findById);

/**
 * @swagger
 * /city:
 *   get:
 *     tags: [City]
 *     summary: Retrieve paginated and filtered city entries
 *     description: Fetches a paginated list of cities with optional filtering and sorting.
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page index (starts from 1)
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Number of items per page
 *     requestBody:
 *       description: Filter and sorting options
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provinceOid:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               cityName:
 *                 type: string
 *                 example: "Jakarta"
 *               fieldName:
 *                 type: string
 *                 example: "cityName"
 *               sortOrder:
 *                 type: integer
 *                 enum: [-1, 0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of paginated cities
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
 *                   example: 25
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "c0a80154-2f7b-4eaa-bb6d-123456789abc"
 *                       provinceOid:
 *                         type: string
 *                         format: uuid
 *                         example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                       cityName:
 *                         type: string
 *                         example: "Jakarta"
 */
router.get('/', validateRequest(filterCityDto), roleGuard('Admin'), cityController.findAll);

module.exports = router;
