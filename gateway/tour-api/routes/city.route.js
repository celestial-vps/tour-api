const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const cityController = require('../controllers/city.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterCityDto,
  createCityDto,
  updateCityDto,
  deleteCityDto,
  getCityDto
} = require('../dtos/payload-city-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: city
 *     description: city management operations
 */

/**
 * @swagger
 * /city/create:
 *   post:
 *     tags: [City]
 *     summary: Create a new city entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              provinceOid:
 *                type: string
 *                example: "-"
 *              cityName:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: city created successfully
 */
router.post('/create', validateRequest(createCityDto), roleGuard('Admin'), cityController.create);

/**
 * @swagger
 * /city/{oid}:
 *   put:
 *     tags: [City]
 *     summary: Update an existing city entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:

 *     responses:
 *       200:
 *         description: city updated successfully
 */
router.put('/:oid', validateRequest(updateCityDto), roleGuard('Admin'), cityController.update);

/**
 * @swagger
 * /city/delete/{oid}:
 *   delete:
 *     tags: [City]
 *     summary: Delete a city entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: city deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteCityDto), roleGuard('Admin'), cityController.remove);

/**
 * @swagger
 * /city:
 *   get:
 *     tags: [City]
 *     summary: Get all citys with optional filters
 *     parameters:
 *       - in: query
 *         name: cityCode
 *         schema:
 *           type: string
 *         description: Filter by cityCode
 *       - in: query
 *         name: cityName
 *         schema:
 *           type: string
 *         description: Filter by cityName
 *     responses:
 *       200:
 *         description: List of citys
 */
router.get('/', validateRequest(filterCityDto), roleGuard('Admin'), cityController.findAll);

/**
 * @swagger
 * /city/q:
 *   post:
 *     tags: [City]
 *     summary: Paginate citys with filters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageIndex:
 *                 type: integer
 *                 example: 1
 *               pageSize:
 *                 type: integer
 *                 example: 10
  *               cityCode:
 *                 type: string
 *                 example: "-"
 *               cityName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of citys
 */
router.post('/q', validateRequest(filterCityDto), roleGuard('Admin'), cityController.find);
/**
 * @swagger
 * /city/{oid}:
 *   get:
 *     tags: [City]
 *     summary: Get a single city by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A city entry
 */

router.get('/:oid', validateRequest(getCityDto), roleGuard('Admin'), cityController.findById);

module.exports = router;
