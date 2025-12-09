const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const districtController = require('../controllers/district.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterDistrictDto,
  createDistrictDto,
  updateDistrictDto,
  deleteDistrictDto,
  getDistrictDto
} = require('../dtos/payload-district-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: District
 *     description: district management operations
 */

/**
 * @swagger
 * /district/create:
 *   post:
 *     tags: [District]
 *     summary: Create a new district entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              cityOid:
 *                type: string
 *                example: "-"
 *              districtName:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: district created successfully
 */
router.post('/create', validateRequest(createDistrictDto), roleGuard('Admin'), districtController.create);

/**
 * @swagger
 * /district/{oid}:
 *   put:
 *     tags: [District]
 *     summary: Update an existing district entry
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
 *         description: district updated successfully
 */
router.put('/:oid', validateRequest(updateDistrictDto), roleGuard('Admin'), districtController.update);

/**
 * @swagger
 * /district/delete/{oid}:
 *   delete:
 *     tags: [District]
 *     summary: Delete a district entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: district deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteDistrictDto), roleGuard('Admin'), districtController.remove);

/**
 * @swagger
 * /district:
 *   get:
 *     tags: [District]
 *     summary: Get all districts with optional filters
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
 *         description: List of districts
 */
router.get('/', validateRequest(filterDistrictDto), roleGuard('Admin'), districtController.findAll);

/**
 * @swagger
 * /district/q:
 *   post:
 *     tags: [District]
 *     summary: Paginate districts with filters
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
 *                 example: "-"
 *               districtName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of districts
 */
router.post('/q', validateRequest(filterDistrictDto), roleGuard('Admin'), districtController.find);
/**
 * @swagger
 * /district/{oid}:
 *   get:
 *     tags: [District]
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
