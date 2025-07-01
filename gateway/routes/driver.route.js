const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const driverController = require('../controllers/driver.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterDriverDto,
  createDriverDto,
  updateDriverDto,
  deleteDriverDto,
  getDriverDto
} = require('../dtos/payload-driver-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Driver
 *     description: Driver management operations
 */

/**
 * @swagger
 * /driver/create:
 *   post:
 *     tags: [Driver]
 *     summary: Create a new Driver entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              userOid:
 *                type: string
 *                example: "-"
 *              licenseNumber:
 *                type: string
 *                example: "-"
 *              licenseExpiry:
 *                type: date
 *                example: "-"
 *              vehicleOid:
 *                type: string
 *                example: "-"
 *              status:
 *                type: string
 *                example: "-"
 *              hiredAt:
 *                type: date
 *                example: "-"
 *              terminatedAt:
 *                type: date
 *                example: "-"
 *              ratingAvg:
 *                type: decimal
 *                example: "-"
 *              totalTrips:
 *                type: integer
 *                example: "-"

 *     responses:
 *       200:
 *         description: Driver created successfully
 */
router.post('/create', validateRequest(createDriverDto), roleGuard('Admin'), driverController.create);

/**
 * @swagger
 * /driver/{oid}:
 *   put:
 *     tags: [Driver]
 *     summary: Update an existing Driver entry
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
 *         description: Driver updated successfully
 */
router.put('/:oid', validateRequest(updateDriverDto), roleGuard('Admin'), driverController.update);

/**
 * @swagger
 * /driver/delete/{oid}:
 *   delete:
 *     tags: [Driver]
 *     summary: Delete a Driver entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteDriverDto), roleGuard('Admin'), driverController.remove);

/**
 * @swagger
 * /driver:
 *   get:
 *     tags: [Driver]
 *     summary: Get all Drivers with optional filters
 *     parameters:
 *       - in: query
 *         name: driverCode
 *         schema:
 *           type: string
 *         description: Filter by driverCode
 *       - in: query
 *         name: driverName
 *         schema:
 *           type: string
 *         description: Filter by driverName
 *     responses:
 *       200:
 *         description: List of Drivers
 */
router.get('/', validateRequest(filterDriverDto), roleGuard('Admin'), driverController.findAll);

/**
 * @swagger
 * /driver/q:
 *   post:
 *     tags: [Driver]
 *     summary: Paginate Drivers with filters
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
  *               driverCode:
 *                 type: string
 *                 example: "-"
 *               driverName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Drivers
 */
router.post('/q', validateRequest(filterDriverDto), roleGuard('Admin'), driverController.find);

/**
 * @swagger
 * /driver/{oid}:
 *   get:
 *     tags: [Driver]
 *     summary: Get a single Driver by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Driver entry
 */

router.get('/:oid', validateRequest(getDriverDto), roleGuard('Admin'), driverController.findById);

module.exports = router;
