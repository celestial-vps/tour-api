'use strict';

const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const cityController = require('../controllers/city-cache.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterCityDto,
  getCityDto
} = require('../dtos/payload-city-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: City Cache
 *     description: city read-only operations
 */

/**
 * @swagger
 * /city-cache:
 *   get:
 *     tags: [City Cache]
 *     summary: Get all countries with optional filters
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
 *         description: List of countries
 */
router.get('/', validateRequest(filterCityDto), roleGuard('Admin'), cityController.findAll);

/**
 * @swagger
 * /city-cache/q:
 *   post:
 *     tags: [City Cache]
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
 *               cityCode:
 *                 type: string
 *                 example: "US"
 *               cityName:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.post('/q',   roleGuard('Admin'), cityController.find);

/**
 * @swagger
 * /city-cache/{oid}:
 *   get:
 *     tags: [City Cache]
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
