const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const vehicleController = require('../controllers/vehicle.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterVehicleDto,
  createVehicleDto,
  updateVehicleDto,
  deleteVehicleDto,
  getVehicleDto
} = require('../dtos/payload-vehicle-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Vehicle
 *     description: Vehicle management operations
 */

/**
 * @swagger
 * /vehicle/create:
 *   post:
 *     tags: [Vehicle]
 *     summary: Create a new vehicle entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              vehicleTypeOid:
 *                type: string
 *                example: "-"
 *              year:
 *                type: interger
 *                example: "-"
 *              color:
 *                type: string
 *                example: "-"
 *              status:
 *                type: string
 *                example: "-"
 *              price_per_day:
 *                type: interger
 *                example: "-"

 *     responses:
 *       200:
 *         description: Vehicle created successfully
 */
router.post('/create', validateRequest(createVehicleDto), roleGuard('Admin'), vehicleController.create);

/**
 * @swagger
 * /vehicle/{oid}:
 *   put:
 *     tags: [Vehicle]
 *     summary: Update an existing vehicle entry
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
 *         description: Vehicle updated successfully
 */
router.put('/:oid', validateRequest(updateVehicleDto), roleGuard('Admin'), vehicleController.update);

/**
 * @swagger
 * /vehicle/delete/{oid}:
 *   delete:
 *     tags: [Vehicle]
 *     summary: Delete a vehicle entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteVehicleDto), roleGuard('Admin'), vehicleController.remove);

/**
 * @swagger
 * /vehicle:
 *   get:
 *     tags: [Vehicle]
 *     summary: Get all vehicles with optional filters
 *     parameters:
 *       - in: query
 *         name: vehicleCode
 *         schema:
 *           type: string
 *         description: Filter by vehicleCode
 *       - in: query
 *         name: vehicleName
 *         schema:
 *           type: string
 *         description: Filter by vehicleName
 *     responses:
 *       200:
 *         description: List of vehicles
 */
router.get('/', validateRequest(filterVehicleDto), roleGuard('Admin'), vehicleController.findAll);

/**
 * @swagger
 * /vehicle/q:
 *   post:
 *     tags: [Vehicle]
 *     summary: Paginate vehicles with filters
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
  *               vehicleCode:
 *                 type: string
 *                 example: "-"
 *               vehicleName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of vehicles
 */
router.post('/q', validateRequest(filterVehicleDto), roleGuard('Admin'), vehicleController.find);
/**
 * @swagger
 * /vehicle/{oid}:
 *   get:
 *     tags: [Vehicle]
 *     summary: Get a single vehicle by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A vehicle entry
 */

router.get('/:oid', validateRequest(getVehicleDto), roleGuard('Admin'), vehicleController.findById);

module.exports = router;
