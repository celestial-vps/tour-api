const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const userRoleController = require('../controllers/user-role.controller');
const { validateRequest } = require('../misc/validation');
const {
    filterUserRoleDto,
    createUserRoleDto,
    updateUserRoleDto,
    deleteUserRoleDto,
    getUserRoleDto
} = require('../dtos/payload-user-role-dto');

const j2s = require('joi-to-swagger');

// Convert DTO ke Swagger schema
const { swagger: createUserRoleSchema } = j2s(createUserRoleDto);
const { swagger: updateUserRoleSchema } = j2s(updateUserRoleDto);
const { swagger: filterUserRoleSchema } = j2s(filterUserRoleDto);

const router = express.Router();

/**
 * @swagger
 * /user-role/create:
 *   post:
 *     tags: [UserRole]
 *     summary: Create a new userRole
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(createUserRoleSchema)}
 *     responses:
 *       200:
 *         description: UserRole created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleName: { type: string, example: "Admin" }
 *                     targetType: { type: string, example: "System" }
 *                     isAdministrative: { type: boolean, example: true }
 *                     readState: { type: boolean, example: true }
 *                     writeState: { type: boolean, example: false }
 *                     createState: { type: boolean, example: true }
 *                     deleteState: { type: boolean, example: false }
 *                     navigateState: { type: boolean, example: true }
 *                     description: { type: string, example: "Full access to system features" }
 *                     createdBy: { type: string, example: "system" }
 *                     createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                     lastModifiedBy: { type: string, example: "admin" }
 *                     updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                     deletedBy: { type: string, example: null }
 *                     deletedAt: { type: string, format: date-time, example: null }
 */
router.post('/create', validateRequest(createUserRoleDto), roleGuard('Admin'), userRoleController.create);

/**
 * @swagger
 * /user-role/{oid}:
 *   put:
 *     tags: [UserRole]
 *     summary: Update an userRole
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(updateUserRoleSchema)}
 *     responses:
 *       200:
 *         description: UserRole updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleName: { type: string, example: "Admin" }
 *                     targetType: { type: string, example: "System" }
 *                     isAdministrative: { type: boolean, example: true }
 *                     readState: { type: boolean, example: true }
 *                     writeState: { type: boolean, example: false }
 *                     createState: { type: boolean, example: true }
 *                     deleteState: { type: boolean, example: false }
 *                     navigateState: { type: boolean, example: true }
 *                     description: { type: string, example: "Full access to system features" }
 *                     createdBy: { type: string, example: "system" }
 *                     createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                     lastModifiedBy: { type: string, example: "admin" }
 *                     updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                     deletedBy: { type: string, example: null }
 *                     deletedAt: { type: string, format: date-time, example: null }
 */
router.put('/:oid', validateRequest(updateUserRoleDto), roleGuard('Admin'), userRoleController.update);

/**
 * @swagger
 * /user-role/delete/{oid}:
 *   delete:
 *     tags: [UserRole]
 *     summary: Delete an userRole
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: UserRole deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleName: { type: string, example: "Admin" }
 *                     targetType: { type: string, example: "System" }
 *                     isAdministrative: { type: boolean, example: true }
 *                     readState: { type: boolean, example: true }
 *                     writeState: { type: boolean, example: false }
 *                     createState: { type: boolean, example: true }
 *                     deleteState: { type: boolean, example: false }
 *                     navigateState: { type: boolean, example: true }
 *                     description: { type: string, example: "Full access to system features" }
 *                     createdBy: { type: string, example: "system" }
 *                     createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                     lastModifiedBy: { type: string, example: "admin" }
 *                     updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                     deletedBy: { type: string, example: null }
 *                     deletedAt: { type: string, format: date-time, example: null }
 */
router.delete('/delete/:oid', validateRequest(deleteUserRoleDto), roleGuard('Admin'), userRoleController.remove);

/**
 * @swagger
 * /user-role:
 *   get:
 *     tags: [UserRole]
 *     summary: Get all userRoles
 *     responses:
 *       200:
 *         description: List of userRoles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleName: { type: string, example: "Admin" }
 *                       targetType: { type: string, example: "System" }
 *                       isAdministrative: { type: boolean, example: true }
 *                       readState: { type: boolean, example: true }
 *                       writeState: { type: boolean, example: false }
 *                       createState: { type: boolean, example: true }
 *                       deleteState: { type: boolean, example: false }
 *                       navigateState: { type: boolean, example: true }
 *                       description: { type: string, example: "Full access to system features" }
 *                       createdBy: { type: string, example: "system" }
 *                       createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                       lastModifiedBy: { type: string, example: "admin" }
 *                       updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                       deletedBy: { type: string, example: null }
 *                       deletedAt: { type: string, format: date-time, example: null }
 */
router.get('/', validateRequest(filterUserRoleDto), roleGuard('Admin'), userRoleController.findAll);

/**
 * @swagger
 * /user-role/{oid}:
 *   get:
 *     tags: [UserRole]
 *     summary: Get a single userRole by ID
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Single userRole
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleName: { type: string, example: "Admin" }
 *                     targetType: { type: string, example: "System" }
 *                     isAdministrative: { type: boolean, example: true }
 *                     readState: { type: boolean, example: true }
 *                     writeState: { type: boolean, example: false }
 *                     createState: { type: boolean, example: true }
 *                     deleteState: { type: boolean, example: false }
 *                     navigateState: { type: boolean, example: true }
 *                     description: { type: string, example: "Full access to system features" }
 *                     createdBy: { type: string, example: "system" }
 *                     createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                     lastModifiedBy: { type: string, example: "admin" }
 *                     updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                     deletedBy: { type: string, example: null }
 *                     deletedAt: { type: string, format: date-time, example: null }
 */
router.get('/:oid', validateRequest(getUserRoleDto), roleGuard('Admin'), userRoleController.findById);

/**
 * @swagger
 * /user-role/q:
 *   post:
 *     tags: [UserRole]
 *     summary: Paginate userRoles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(filterUserRoleSchema)}
 *     responses:
 *       200:
 *         description: Paginated list of userRoles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleName: { type: string, example: "Admin" }
 *                       targetType: { type: string, example: "System" }
 *                       isAdministrative: { type: boolean, example: true }
 *                       readState: { type: boolean, example: true }
 *                       writeState: { type: boolean, example: false }
 *                       createState: { type: boolean, example: true }
 *                       deleteState: { type: boolean, example: false }
 *                       navigateState: { type: boolean, example: true }
 *                       description: { type: string, example: "Full access to system features" }
 *                       createdBy: { type: string, example: "system" }
 *                       createdAt: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                       lastModifiedBy: { type: string, example: "admin" }
 *                       updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *                       deletedBy: { type: string, example: null }
 *                       deletedAt: { type: string, format: date-time, example: null }
 */
router.post('/q', validateRequest(filterUserRoleDto), roleGuard('Admin'), userRoleController.find);

module.exports = router;
