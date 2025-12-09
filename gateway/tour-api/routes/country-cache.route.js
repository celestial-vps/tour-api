'use strict';

const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const countryController = require('../controllers/country-cache.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterCountryDto,
  getCountryDto
} = require('../dtos/payload-country-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Country Cache
 *     description: country read-only operations
 */

/**
 * @swagger
 * /country-cache:
 *   get:
 *     tags: [Country Cache]
 *     summary: Get all countries with optional filters
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
 *         description: List of countries
 */
router.get('/', validateRequest(filterCountryDto), roleGuard('Admin'), countryController.findAll);

/**
 * @swagger
 * /country-cache/q:
 *   post:
 *     tags: [Country Cache]
 *     summary: Paginate countries with filters
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
 *                 example: "US"
 *               countryName:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.post('/q',   roleGuard('Admin'), countryController.find);

/**
 * @swagger
 * /country-cache/{oid}:
 *   get:
 *     tags: [Country Cache]
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
