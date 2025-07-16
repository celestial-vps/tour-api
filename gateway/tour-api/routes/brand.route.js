const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const brandController = require('../controllers/brand.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterBrandDto,
  createBrandDto,
  updateBrandDto,
  deleteBrandDto,
  getBrandDto
} = require('../dtos/payload-brand-dto');
const upload = require('../config/multer-storage'); // Import the multer configuration

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Brand
 *     description: Brand management operations
 */

/**
 * @swagger
 * /brand/create:
 *   post:
 *     tags: [Brand]
 *     summary: Create a new brand entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              brandName:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Brand created successfully
 */
router.post('/create', validateRequest(createBrandDto), roleGuard('Admin'), brandController.create);

/**
 * @swagger
 * /brand/{oid}:
 *   put:
 *     tags: [Brand]
 *     summary: Update an existing brand entry
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
 *         description: Brand updated successfully
 */
router.put('/:oid', validateRequest(updateBrandDto), roleGuard('Admin'), brandController.update);

/**
 * @swagger
 * /brand/delete/{oid}:
 *   delete:
 *     tags: [Brand]
 *     summary: Delete a brand entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteBrandDto), roleGuard('Admin'), brandController.remove);

/**
 * @swagger
 * /brand:
 *   get:
 *     tags: [Brand]
 *     summary: Get all brands with optional filters
 *     parameters:
 *       - in: query
 *         name: brandCode
 *         schema:
 *           type: string
 *         description: Filter by brandCode
 *       - in: query
 *         name: brandName
 *         schema:
 *           type: string
 *         description: Filter by brandName
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/', validateRequest(filterBrandDto), roleGuard('Admin'), brandController.findAll);

/**
 * @swagger
 * /brand/q:
 *   post:
 *     tags: [Brand]
 *     summary: Paginate brands with filters
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
  *               brandCode:
 *                 type: string
 *                 example: "-"
 *               brandName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of brands
 */
router.post('/q', validateRequest(filterBrandDto), roleGuard('Admin'), brandController.find);
/**
 * @swagger
 * /brand/{oid}:
 *   get:
 *     tags: [Brand]
 *     summary: Get a single brand by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A brand entry
 */

router.get('/:oid', validateRequest(getBrandDto), roleGuard('Admin'), brandController.findById);

module.exports = router;
