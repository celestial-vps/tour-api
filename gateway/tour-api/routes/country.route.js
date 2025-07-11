const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const countryController = require('../controllers/country.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterCountryDto,
  createCountryDto,
  updateCountryDto,
  deleteCountryDto,
  getCountryDto
} = require('../dtos/payload-country-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: country
 *     description: country management operations
 */

/**
 * @swagger
 * /country/create:
 *   post:
 *     tags: [Country]
 *     summary: Create a new country entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              countryCode:
 *                type: string
 *                example: "-"
 *              countryName:
 *                type: string
 *                example: "-"
 *              countryCurrency:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: country created successfully
 */
router.post('/create', validateRequest(createCountryDto), roleGuard('Admin'), countryController.create);

/**
 * @swagger
 * /country/{oid}:
 *   put:
 *     tags: [Country]
 *     summary: Update an existing country entry
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
 *         description: country updated successfully
 */
router.put('/:oid', validateRequest(updateCountryDto), roleGuard('Admin'), countryController.update);

/**
 * @swagger
 * /country/delete/{oid}:
 *   delete:
 *     tags: [Country]
 *     summary: Delete a country entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: country deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteCountryDto), roleGuard('Admin'), countryController.remove);

/**
 * @swagger
 * /country:
 *   get:
 *     tags: [Country]
 *     summary: Get all countrys with optional filters
 *     parameters:
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *         description: Filter by countryCode
 *       - in: query
 *         name: countryName
 *         schema:
 *           type: string
 *         description: Filter by countryName
 *     responses:
 *       200:
 *         description: List of countrys
 */
router.get('/', validateRequest(filterCountryDto), roleGuard('Admin'), countryController.findAll);

/**
 * @swagger
 * /country/q:
 *   post:
 *     tags: [Country]
 *     summary: Paginate countrys with filters
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
  *               countryCode:
 *                 type: string
 *                 example: "-"
 *               countryName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of countrys
 */
router.post('/q', validateRequest(filterCountryDto), roleGuard('Admin'), countryController.find);
/**
 * @swagger
 * /country/{oid}:
 *   get:
 *     tags: [Country]
 *     summary: Get a single country by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A country entry
 */

router.get('/:oid', validateRequest(getCountryDto), roleGuard('Admin'), countryController.findById);

module.exports = router;
