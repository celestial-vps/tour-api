const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const vehicleTypeController = require('../controllers/vehicle-type.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterVehicleTypeDto,
  createVehicleTypeDto,
  updateVehicleTypeDto,
  deleteVehicleTypeDto,
  getVehicleTypeDto
} = require('../dtos/payload-vehicle-type-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: VehicleType
 *     description: VehicleType management operations
 */

/**
 * @swagger
 * /vehicletype/create:
 *   post:
 *     tags: [Vehicletype]
 *     summary: Create a new vehicletype entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              vehicleType:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: VehicleType created successfully
 */
router.post('/create', validateRequest(createVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.create);

/**
 * @swagger
 * /vehicletype/{oid}:
 *   put:
 *     tags: [Vehicletype]
 *     summary: Update an existing vehicletype entry
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
 *         description: VehicleType updated successfully
 */
router.put('/:oid', validateRequest(updateVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.update);

/**
 * @swagger
 * /vehicletype/delete/{oid}:
 *   delete:
 *     tags: [Vehicletype]
 *     summary: Delete a vehicletype entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: VehicleType deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.remove);

/**
 * @swagger
 * /vehicletype:
 *   get:
 *     tags: [Vehicletype]
 *     summary: Get all vehicletypes with optional filters
 *     parameters:
 *       - in: query
 *         name: vehicletypeCode
 *         schema:
 *           type: string
 *         description: Filter by vehicletypeCode
 *       - in: query
 *         name: vehicletypeName
 *         schema:
 *           type: string
 *         description: Filter by vehicletypeName
 *     responses:
 *       200:
 *         description: List of vehicletypes
 */
router.get('/', validateRequest(filterVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.findAll);

/**
 * @swagger
 * /vehicletype/q:
 *   post:
 *     tags: [Vehicletype]
 *     summary: Paginate vehicletypes with filters
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
  *               vehicletypeCode:
 *                 type: string
 *                 example: "-"
 *               vehicletypeName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of vehicletypes
 */
router.post('/q', validateRequest(filterVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.find);
/**
 * @swagger
 * /vehicletype/{oid}:
 *   get:
 *     tags: [Vehicletype]
 *     summary: Get a single vehicletype by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A vehicletype entry
 */

router.get('/:oid', validateRequest(getVehicleTypeDto), roleGuard('Admin'), vehicleTypeController.findById);

module.exports = router;
