const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const { validateRequest } = require('../misc/validation');
const {
  createVehicleTypeDto,
  updateVehicleTypeDto,
  deleteVehicleTypeDto,
  getVehicleTypeDto,
  filterVehicleTypeDto
} = require('../dtos/payload-vehicle-type-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: VehicleType
 *     description: Operations related to vehicle types
 */

/**
 * @swagger
 * /vehicle-type/create:
 *   post:
 *     tags: [VehicleType]
 *     summary: Create a vehicle type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleType:
 *                 type: string
 *                 example: "SUV"
 *     responses:
 *       200:
 *         description: Vehicle type created
 */
router.post('/create', validateRequest(createVehicleTypeDto), roleGuard('Admin'), (req, res) => {
  res.status(200).json({ message: 'Stub for create vehicle type' });
});

/**
 * @swagger
 * /vehicle-type/{oid}:
 *   put:
 *     tags: [VehicleType]
 *     summary: Update a vehicle type
 *     parameters:
 *       - in: path
 *         name: oid
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
 *               vehicleType:
 *                 type: string
 *                 example: "Electric SUV"
 *     responses:
 *       200:
 *         description: Vehicle type updated
 */
router.put('/:oid', validateRequest(updateVehicleTypeDto), roleGuard('Admin'), (req, res) => {
  res.status(200).json({ message: 'Stub for update vehicle type' });
});

/**
 * @swagger
 * /vehicle-type/delete/{oid}:
 *   delete:
 *     tags: [VehicleType]
 *     summary: Delete a vehicle type
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vehicle type deleted
 */
router.delete('/delete/:oid', validateRequest(deleteVehicleTypeDto), roleGuard('Admin'), (req, res) => {
  res.status(200).json({ message: 'Stub for delete vehicle type' });
});

/**
 * @swagger
 * /vehicle-type/q:
 *   post:
 *     tags: [VehicleType]
 *     summary: Filter vehicle types with pagination
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleType:
 *                 type: string
 *                 example: ""
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Filtered vehicle types
 */
router.post('/q', validateRequest(filterVehicleTypeDto), roleGuard('Admin'), (req, res) => {
  res.status(200).json({ message: 'Stub for filter vehicle types' });
});

/**
 * @swagger
 * /vehicle-type/{oid}:
 *   get:
 *     tags: [VehicleType]
 *     summary: Get vehicle type by ID
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Vehicle type detail
 */
router.get('/:oid', validateRequest(getVehicleTypeDto), roleGuard('Admin'), (req, res) => {
  res.status(200).json({ message: 'Stub for get vehicle type by oid' });
});

module.exports = router;
