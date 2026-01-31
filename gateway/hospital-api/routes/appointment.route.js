const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const appointmentController = require('../controllers/appointment.controller');
const { validateRequest } = require('../misc/validation');
const {
  createAppointmentDto,
  updateAppointmentDto,
  deleteAppointmentDto,
  filterAppointmentDto,
  getAppointmentDto
} = require('../dtos/payload-appointment-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Appointment (Queue) management operations
 */

/**
 * @swagger
 * /appointments/create:
 *   post:
 *     tags: [Appointments]
 *     summary: Create a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointment'
 *     responses:
 *       200:
 *         description: Appointment created successfully
 */
router.post('/create', validateRequest(createAppointmentDto), roleGuard('Admin'), appointmentController.create);

/**
 * @swagger
 * /appointments/{oid}:
 *   put:
 *     tags: [Appointments]
 *     summary: Update an existing appointment
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
 *             $ref: '#/components/schemas/UpdateAppointment'
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 */
router.put('/:oid', validateRequest(updateAppointmentDto), roleGuard('Admin'), appointmentController.update);

/**
 * @swagger
 * /appointments/delete/{oid}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Delete an appointment
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteAppointmentDto), roleGuard('Admin'), appointmentController.remove);

/**
 * @swagger
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get all appointments
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/', validateRequest(filterAppointmentDto), roleGuard('Admin'), appointmentController.findAll);

/**
 * @swagger
 * /appointments/q:
 *   post:
 *     tags: [Appointments]
 *     summary: Paginate appointments
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilterAppointment'
 *     responses:
 *       200:
 *         description: Paginated list of appointments
 */
router.post('/q', validateRequest(filterAppointmentDto), roleGuard('Admin'), appointmentController.find);

/**
 * @swagger
 * /appointments/{oid}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get a single appointment by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single appointment entry
 */
router.get('/:oid', validateRequest(getAppointmentDto), roleGuard('Admin'), appointmentController.findById);

module.exports = router;
