const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const departmentController = require('../controllers/department.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createDepartmentDto,
  updateDepartmentDto,
  deleteDepartmentDto,
  filterDepartmentDto,
  getDepartmentDto
} = require('../dtos/payload-department-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createDepartmentSchema } = j2s(createDepartmentDto);
const { swagger: updateDepartmentSchema } = j2s(updateDepartmentDto);
const { swagger: filterDepartmentSchema } = j2s(filterDepartmentDto);

/**
 * @swagger
 * tags:
 *   - name: Department
 *     description: Department management operations
 */

/**
 * @swagger
 * /department/create:
 *   post:
 *     tags: [Department]
 *     summary: Create a new department entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cardiology"
 *     responses:
 *       200:
 *         description: Department created successfully
 */
router.post('/create', validateRequest(createDepartmentDto), roleGuard('Admin'), departmentController.create);

/**
 * @swagger
 * /department/{oid}:
 *   put:
 *     tags: [Department]
 *     summary: Update an existing department entry
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
 *               name:
 *                 type: string
 *                 example: "Neurology"
 *     responses:
 *       200:
 *         description: Department updated successfully
 */
router.put('/:oid', validateRequest(updateDepartmentDto), roleGuard('Admin'), departmentController.update);

/**
 * @swagger
 * /department/delete/{oid}:
 *   delete:
 *     tags: [Department]
 *     summary: Delete a department entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteDepartmentDto), roleGuard('Admin'), departmentController.remove);

/**
 * @swagger
 * /department:
 *   get:
 *     tags: [Department]
 *     summary: Get all departments
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/', validateRequest(filterDepartmentDto), roleGuard('Admin'), departmentController.findAll);

/**
 * @swagger
 * /department/q:
 *   post:
 *     tags: [Department]
 *     summary: Paginate departments
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
 *               name:
 *                 type: string
 *                 example: "Cardiology"
 *     responses:
 *       200:
 *         description: Paginated list of departments
 */
router.post('/q', validateRequest(filterDepartmentDto), roleGuard('Admin'), departmentController.find);

/**
 * @swagger
 * /department/{oid}:
 *   get:
 *     tags: [Department]
 *     summary: Get a single department by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A department entry
 */
router.get('/:oid', validateRequest(getDepartmentDto), roleGuard('Admin'), departmentController.findById);

module.exports = router;
