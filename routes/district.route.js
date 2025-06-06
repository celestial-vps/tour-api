const express = require('express');
const districtController = require('../controllers/district.controller');
const { validateRequest } = require('../misc/validation');
const { roleGuard } = require('../middleware/role-guard');
const {
  createDistrictRequestDto,
  updateDistrictRequestDto,
  deleteDistrictDto,
  getDistrictDto,
  filterDistrictDto
} = require('../dtos/district.dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: District
 *     description: District management endpoints
 */

/**
 * @swagger
 * /district/create:
 *   post:
 *     tags: [District]
 *     summary: Create a new district
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cityOid
 *               - districtName
 *             properties:
 *               cityOid:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               districtName:
 *                 type: string
 *                 example: "Central District"
 *     responses:
 *       200:
 *         description: District created successfully
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
 *                     cityOid:
 *                       type: string
 *                       format: uuid
 *                     districtName:
 *                       type: string
 */
router.post('/create', validateRequest(createDistrictRequestDto), roleGuard('Admin'), districtController.create);

/**
 * @swagger
 * /district/{oid}:
 *   put:
 *     tags: [District]
 *     summary: Update district by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the district to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cityOid
 *               - districtName
 *             properties:
 *               cityOid:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               districtName:
 *                 type: string
 *                 example: "Central District Updated"
 *     responses:
 *       200:
 *         description: District updated successfully
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
router.put('/:oid', validateRequest(updateDistrictRequestDto), roleGuard('Admin'), districtController.update);

/**
 * @swagger
 * /district/delete/{oid}:
 *   delete:
 *     tags: [District]
 *     summary: Delete district by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the district to delete
 *     responses:
 *       200:
 *         description: District deleted successfully
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
router.delete('/delete/:oid', validateRequest(deleteDistrictDto), roleGuard('Admin'), districtController.delete);

/**
 * @swagger
 * /district/{oid}:
 *   get:
 *     tags: [District]
 *     summary: Get district by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the district to retrieve
 *     responses:
 *       200:
 *         description: District data
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
 *                     cityOid:
 *                       type: string
 *                       format: uuid
 *                     districtName:
 *                       type: string
 */
router.get('/:oid', validateRequest(getDistrictDto), roleGuard('Admin'), districtController.findById);

/**
 * @swagger
 * /district:
 *   get:
 *     tags: [District]
 *     summary: Get list of districts with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         required: true
 *         description: Number of records per page
 *     requestBody:
 *       description: Filter parameters (optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cityOid:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               districtName:
 *                 type: string
 *                 example: "Central District"
 *               fieldName:
 *                 type: string
 *                 example: "districtName"
 *               sortOrder:
 *                 type: integer
 *                 enum: [-1, 0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of districts
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
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                       cityOid:
 *                         type: string
 *                         format: uuid
 *                       districtName:
 *                         type: string
 */
router.get('/', validateRequest(filterDistrictDto), roleGuard('Admin'), districtController.findAll);

module.exports = router;
