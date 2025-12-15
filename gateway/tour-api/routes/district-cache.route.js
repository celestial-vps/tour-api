'use strict';

const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const districtController = require('../controllers/district-cache.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterDistrictDto,
  getDistrictDto
} = require('../dtos/payload-district-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: District Cache
 *     description: district read-only operations
 */

/**
 * @swagger
 * /district-cache:
 *   get:
 *     tags: [District Cache]
 *     summary: Get all countries with optional filters
 *     parameters:
 *       - in: query
 *         name: districtCode
 *         schema:
 *           type: string
 *         description: Filter by districtCode
 *       - in: query
 *         name: districtName
 *         schema:
 *           type: string
 *         description: Filter by districtName
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get('/', validateRequest(filterDistrictDto), roleGuard('Admin'), districtController.findAll);

/**
 * @swagger
 * /district-cache/q:
 *   post:
 *     tags: [District Cache]
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
 *               districtCode:
 *                 type: string
 *                 example: "US"
 *               districtName:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.post('/q',   roleGuard('Admin'), districtController.find);

/**
 * @swagger
 * /district-cache/{oid}:
 *   get:
 *     tags: [District Cache]
 *     summary: Get a single district by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A district entry
 */
router.get('/:oid', validateRequest(getDistrictDto), roleGuard('Admin'), districtController.findById);

module.exports = router;
