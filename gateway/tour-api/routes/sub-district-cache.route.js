'use strict';

const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const subDistrictController = require('../controllers/sub-district-cache.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterSubDistrictDto,
  getSubDistrictDto
} = require('../dtos/payload-sub-district-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sub District Cache
 *     description: subDistrict read-only operations
 */

/**
 * @swagger
 * /sub-district-cache:
 *   get:
 *     tags: [Sub District Cache]
 *     summary: Get all countries with optional filters
 *     parameters:
 *       - in: query
 *         name: subDistrictCode
 *         schema:
 *           type: string
 *         description: Filter by subDistrictCode
 *       - in: query
 *         name: subDistrictName
 *         schema:
 *           type: string
 *         description: Filter by subDistrictName
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get('/', validateRequest(filterSubDistrictDto), roleGuard('Admin'), subDistrictController.findAll);

/**
 * @swagger
 * /sub-district-cache/q:
 *   post:
 *     tags: [Sub District Cache]
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
 *               subDistrictCode:
 *                 type: string
 *                 example: "US"
 *               subDistrictName:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.post('/q',   roleGuard('Admin'), subDistrictController.find);

/**
 * @swagger
 * /sub-district-cache/{oid}:
 *   get:
 *     tags: [Sub District Cache]
 *     summary: Get a single subDistrict by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A subDistrict entry
 */
router.get('/:oid', validateRequest(getSubDistrictDto), roleGuard('Admin'), subDistrictController.findById);

module.exports = router;
