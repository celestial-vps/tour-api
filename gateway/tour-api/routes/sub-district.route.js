const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const subDistrictController = require('../controllers/sub-district.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterSubDistrictDto,
  createSubDistrictDto,
  updateSubDistrictDto,
  deleteSubDistrictDto,
  getSubDistrictDto
} = require('../dtos/payload-sub-district-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sub District
 *     description: SubDistrict management operations
 */

/**
 * @swagger
 * /sub-district/create:
 *   post:
 *     tags: [Sub District]
 *     summary: Create a new subdistrict entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              districtOid:
 *                type: string
 *                example: "-"
 *              subDistrictName:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: SubDistrict created successfully
 */
router.post('/create', validateRequest(createSubDistrictDto), roleGuard('Admin'), subDistrictController.create);

/**
 * @swagger
 * /sub-district/{oid}:
 *   put:
 *     tags: [Sub District]
 *     summary: Update an existing subdistrict entry
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
 *         description: SubDistrict updated successfully
 */
router.put('/:oid', validateRequest(updateSubDistrictDto), roleGuard('Admin'), subDistrictController.update);

/**
 * @swagger
 * /subdistrict/delete/{oid}:
 *   delete:
 *     tags: [Sub District]
 *     summary: Delete a subdistrict entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: SubDistrict deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteSubDistrictDto), roleGuard('Admin'), subDistrictController.remove);

/**
 * @swagger
 * /subdistrict:
 *   get:
 *     tags: [Sub District]
 *     summary: Get all subdistricts with optional filters
 *     parameters:
 *       - in: query
 *         name: subdistrictCode
 *         schema:
 *           type: string
 *         description: Filter by subdistrictCode
 *       - in: query
 *         name: subdistrictName
 *         schema:
 *           type: string
 *         description: Filter by subdistrictName
 *     responses:
 *       200:
 *         description: List of subdistricts
 */
router.get('/', validateRequest(filterSubDistrictDto), roleGuard('Admin'), subDistrictController.findAll);

/**
 * @swagger
 * /subdistrict/q:
 *   post:
 *     tags: [Sub District]
 *     summary: Paginate subdistricts with filters
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
  *               subdistrictCode:
 *                 type: string
 *                 example: "-"
 *               subdistrictName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of subdistricts
 */
router.post('/q', validateRequest(filterSubDistrictDto), roleGuard('Admin'), subDistrictController.find);
/**
 * @swagger
 * /subdistrict/{oid}:
 *   get:
 *     tags: [Sub District]
 *     summary: Get a single subdistrict by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A subdistrict entry
 */

router.get('/:oid', validateRequest(getSubDistrictDto), roleGuard('Admin'), subDistrictController.findById);

module.exports = router;
