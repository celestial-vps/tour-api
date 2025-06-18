const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const provinceController = require('../controllers/province.controller');
const { validateRequest } = require('../misc/validation');
const {
    createProvinceDto,
    updateProvinceDto,
    deleteProvinceDto,
    getProvinceDto,
    filterProvinceDto
} = require('../dtos/payload-province-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Province
 *     description: Province management operations
 */

/**
 * @swagger
 * /province/create:
 *   post:
 *     tags: [Province]
 *     summary: Create a new province
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryOid:
 *                 type: string
 *                 format: uuid
 *                 example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *               provinceName:
 *                 type: string
 *                 example: "West Java"
 *     responses:
 *       200:
 *         description: Province created successfully
 */
router.post(
    '/create',
    validateRequest(createProvinceDto),
    roleGuard('Admin'),
    provinceController.create
);

/**
 * @swagger
 * /province/{oid}:
 *   put:
 *     tags: [Province]
 *     summary: Update a province
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryOid:
 *                 type: string
 *                 format: uuid
 *                 example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *               provinceName:
 *                 type: string
 *                 example: "East Java"
 *     responses:
 *       200:
 *         description: Province updated successfully
 */
router.put(
    '/:oid',
    validateRequest(updateProvinceDto),
    roleGuard('Admin'),
    provinceController.update
);

/**
 * @swagger
 * /province/delete/{oid}:
 *   delete:
 *     tags: [Province]
 *     summary: Delete a province
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *     responses:
 *       200:
 *         description: Province deleted successfully
 */
router.delete(
    '/delete/:oid',
    validateRequest(deleteProvinceDto),
    roleGuard('Admin'),
    provinceController.remove
);

/**
 * @swagger
 * /province/q:
 *   post:
 *     tags: [Province]
 *     summary: Query provinces with filters and pagination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countryOid:
 *                 type: string
 *                 format: uuid
 *                 example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *               provinceName:
 *                 type: string
 *                 example: "Java"
 *               fieldName:
 *                 type: string
 *                 example: "provinceName"
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of provinces
 */
router.post(
    '/q',
    validateRequest(filterProvinceDto),
    roleGuard('Admin'),
    provinceController.find
);

/**
 * @swagger
 * /province/{oid}:
 *   get:
 *     tags: [Province]
 *     summary: Get province by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f0a9b912-4b21-4a09-89c1-b947d8431e72"
 *     responses:
 *       200:
 *         description: Province retrieved successfully
 */
router.get(
    '/:oid',
    validateRequest(getProvinceDto),
    roleGuard('Admin'),
    provinceController.findById
);

module.exports = router;
