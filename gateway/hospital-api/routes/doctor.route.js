const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const doctorController = require('../controllers/doctor.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createDoctorDto,
  updateDoctorDto,
  deleteDoctorDto,
  filterDoctorDto,
  getDoctorDto
} = require('../dtos/payload-doctor-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createDoctorSchema } = j2s(createDoctorDto);
const { swagger: updateDoctorSchema } = j2s(updateDoctorDto);
const { swagger: filterDoctorSchema } = j2s(filterDoctorDto);

/**
 * @swagger
 * tags:
 *   - name: Doctor
 *     description: Doctor management operations
 */

/**
 * @swagger
 * /doctor/create:
 *   post:
 *     tags: [Doctor]
 *     summary: Create a new doctor entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userOid:
 *                 type: string
 *                 format: uuid
 *                 example: "c56a4180-65aa-42ec-a945-5fd21dec0538"
 *               specializationOid:
 *                 type: string
 *                 format: uuid
 *                 example: "e1b5f6f2-5b8a-4b6a-bd8e-59c1e5b2a2f4"
 *               phone:
 *                 type: string
 *                 example: "+628123456789"
 *     responses:
 *       200:
 *         description: Doctor created successfully
 */
router.post('/create', validateRequest(createDoctorDto), roleGuard('Admin'), doctorController.create);

/**
 * @swagger
 * /doctor/{oid}:
 *   put:
 *     tags: [Doctor]
 *     summary: Update an existing doctor entry
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
 *               specializationOid:
 *                 type: string
 *                 format: uuid
 *                 example: "e1b5f6f2-5b8a-4b6a-bd8e-59c1e5b2a2f4"
 *               phone:
 *                 type: string
 *                 example: "+628123456789"
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 */
router.put('/:oid', validateRequest(updateDoctorDto), roleGuard('Admin'), doctorController.update);

/**
 * @swagger
 * /doctor/delete/{oid}:
 *   delete:
 *     tags: [Doctor]
 *     summary: Delete a doctor entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteDoctorDto), roleGuard('Admin'), doctorController.remove);

/**
 * @swagger
 * /doctor:
 *   get:
 *     tags: [Doctor]
 *     summary: Get all doctors
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/', validateRequest(filterDoctorDto), roleGuard('Admin'), doctorController.findAll);

/**
 * @swagger
 * /doctor/q:
 *   post:
 *     tags: [Doctor]
 *     summary: Paginate doctors
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specializationOid:
 *                 type: string
 *                 format: uuid
 *                 example: "e1b5f6f2-5b8a-4b6a-bd8e-59c1e5b2a2f4"
 *     responses:
 *       200:
 *         description: Paginated list of doctors
 */
router.post('/q', validateRequest(filterDoctorDto), roleGuard('Admin'), doctorController.find);

/**
 * @swagger
 * /doctor/{oid}:
 *   get:
 *     tags: [Doctor]
 *     summary: Get a single doctor by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A doctor entry
 */
router.get('/:oid', validateRequest(getDoctorDto), roleGuard('Admin'), doctorController.findById);

module.exports = router;
