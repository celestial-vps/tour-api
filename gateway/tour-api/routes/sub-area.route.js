const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const subAreaController = require('../controllers/sub-area.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterSubAreaDto,
  createSubAreaDto,
  updateSubAreaDto,
  deleteSubAreaDto,
  getSubAreaDto
} = require('../dtos/payload-sub-area-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Sub Area
 *     description: Sub Area management operations
 */

/**
 * @swagger
 * /sub-area/create:
 *   post:
 *     tags: [Sub Area]
 *     summary: Create a new Sub Area entry
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
 *              subAreaName:
 *                type: string
 *                example: "-"
 *              latitude:
 *                type: DECIMAL
 *                example: "-"
 *              longitude:
 *                type: DECIMAL
 *                example: "-"
 *              address:
 *                type: string
 *                example: "-"
 *              phoneNumber:
 *                type: string
 *                example: "-"
 *              email:
 *                type: string
 *                example: "-"
 *              openingHour:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Sub Area created successfully
 */
router.post('/create', validateRequest(createSubAreaDto), roleGuard('Admin'), subAreaController.create);

/**
 * @swagger
 * /sub-area/{oid}:
 *   put:
 *     tags: [Sub Area]
 *     summary: Update an existing Sub Area entry
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
 *         description: Sub Area updated successfully
 */
router.put('/:oid', validateRequest(updateSubAreaDto), roleGuard('Admin'), subAreaController.update);

/**
 * @swagger
 * /sub-area/delete/{oid}:
 *   delete:
 *     tags: [Sub Area]
 *     summary: Delete a Sub Area entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sub Area deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteSubAreaDto), roleGuard('Admin'), subAreaController.remove);

/**
 * @swagger
 * /sub-area:
 *   get:
 *     tags: [Sub Area]
 *     summary: Get all Sub Areas with optional filters
 *     parameters:
 *       - in: query
 *         name: subAreaCode
 *         schema:
 *           type: string
 *         description: Filter by subAreaCode
 *       - in: query
 *         name: subAreaName
 *         schema:
 *           type: string
 *         description: Filter by subAreaName
 *     responses:
 *       200:
 *         description: List of Sub Areas
 */
router.get('/', validateRequest(filterSubAreaDto), roleGuard('Admin'), subAreaController.findAll);

router.get('/no-auth',  subAreaController.findAll);

/**
 * @swagger
 * /sub-area/q:
 *   post:
 *     tags: [Sub Area]
 *     summary: Paginate Sub Areas with filters
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
  *               subAreaCode:
 *                 type: string
 *                 example: "-"
 *               subAreaName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Sub Areas
 */
router.post('/q', validateRequest(filterSubAreaDto), roleGuard('Admin'), subAreaController.find);

/**
 * @swagger
 * /sub-area/{oid}:
 *   get:
 *     tags: [Sub Area]
 *     summary: Get a single Sub Area by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Sub Area entry
 */

router.get('/:oid', validateRequest(getSubAreaDto), roleGuard('Admin'), subAreaController.findById);

module.exports = router;
