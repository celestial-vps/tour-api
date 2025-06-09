// const express = require('express');
// const { roleGuard } = require('../middleware/role-guard');
// const { validateRequest } = require('../misc/validation');
// const {
//   createVehicleDto,
//   updateVehicleDto,
//   deleteVehicleDto,
//   getVehicleDto,
//   filterVehicleDto
// } = require('../dtos/payload-vehicle-dto');

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Vehicle
//  *     description: Operations related to vehicles
//  */

// /**
//  * @swagger
//  * /vehicle/create:
//  *   post:
//  *     tags: [Vehicle]
//  *     summary: Create a new vehicle
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               vehicleTypeOid:
//  *                 type: string
//  *               year:
//  *                 type: integer
//  *               color:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [available, rented, service]
//  *               price_per_day:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Vehicle created successfully
//  */
// router.post('/create', validateRequest(createVehicleDto), roleGuard('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Stub for vehicle creation' });
// });

// /**
//  * @swagger
//  * /vehicle/{oid}:
//  *   put:
//  *     tags: [Vehicle]
//  *     summary: Update vehicle
//  *     parameters:
//  *       - in: path
//  *         name: oid
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               vehicleTypeOid:
//  *                 type: string
//  *               year:
//  *                 type: integer
//  *               color:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *               price_per_day:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Vehicle updated
//  */
// router.put('/:oid', validateRequest(updateVehicleDto), roleGuard('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Stub for vehicle update' });
// });

// /**
//  * @swagger
//  * /vehicle/delete/{oid}:
//  *   delete:
//  *     tags: [Vehicle]
//  *     summary: Delete vehicle
//  *     parameters:
//  *       - in: path
//  *         name: oid
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Vehicle deleted
//  */
// router.delete('/delete/:oid', validateRequest(deleteVehicleDto), roleGuard('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Stub for vehicle deletion' });
// });

// /**
//  * @swagger
//  * /vehicle/q:
//  *   post:
//  *     tags: [Vehicle]
//  *     summary: Filter vehicles with pagination
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               vehicleTypeOid:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *               color:
//  *                 type: string
//  *     parameters:
//  *       - in: query
//  *         name: pageIndex
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: pageSize
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Filtered vehicle list
//  */
// router.post('/q', validateRequest(filterVehicleDto), roleGuard('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Stub for vehicle filtering' });
// });

// /**
//  * @swagger
//  * /vehicle/{oid}:
//  *   get:
//  *     tags: [Vehicle]
//  *     summary: Get vehicle by ID
//  *     parameters:
//  *       - in: path
//  *         name: oid
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Vehicle details
//  */
// router.get('/:oid', validateRequest(getVehicleDto), roleGuard('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Stub for vehicle details' });
// });

// module.exports = router;
