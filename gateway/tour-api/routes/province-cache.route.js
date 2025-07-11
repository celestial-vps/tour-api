'use strict';

const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const provinceController = require('../controllers/province-cache.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterProvinceDto,
  getProvinceDto
} = require('../dtos/payload-province-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: province
 *     description: province read-only operations
 */

/**
 * @swagger
 * /province:
 *   get:
 *     tags: [province]
 *     summary: Get all countries with optional filters
 *     parameters:
 *       - in: query
 *         name: provinceCode
 *         schema:
 *           type: string
 *         description: Filter by provinceCode
 *       - in: query
 *         name: provinceName
 *         schema:
 *           type: string
 *         description: Filter by provinceName
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get('/', validateRequest(filterProvinceDto), roleGuard('Admin'), provinceController.findAll);

/**
 * @swagger
 * /province/q:
 *   post:
 *     tags: [province]
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
 *               provinceCode:
 *                 type: string
 *                 example: "US"
 *               provinceName:
 *                 type: string
 *                 example: "United States"
 *     responses:
 *       200:
 *         description: Paginated list of countries
 */
router.post('/q',   roleGuard('Admin'), provinceController.find);

/**
 * @swagger
 * /province/{oid}:
 *   get:
 *     tags: [province]
 *     summary: Get a single province by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A province entry
 */
router.get('/:oid', validateRequest(getProvinceDto), roleGuard('Admin'), provinceController.findById);

module.exports = router;
