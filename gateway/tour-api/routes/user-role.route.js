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

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User Role
 *     description: User Role management operations
 */

/**
 * @swagger
 * /user-role/create:
 *   post:
 *     tags: [User Role]
 *     summary: Create a new User Role entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              roleName:
 *                type: string
 *                example: "-"
 *              targetType:
 *                type: string
 *                example: "-"
 *              isAdministrative:
 *                type: BOOLEAN
 *                example: "-"
 *              readState:
 *                type: BOOLEAN
 *                example: "-"
 *              writeState:
 *                type: BOOLEAN
 *                example: "-"
 *              createState:
 *                type: BOOLEAN
 *                example: "-"
 *              deleteState:
 *                type: BOOLEAN
 *                example: "-"
 *              navigateState:
 *                type: BOOLEAN
 *                example: "-"

 *     responses:
 *       200:
 *         description: User Role created successfully
 */
router.post('/create', validateRequest(createUserRoleDto), roleGuard('Admin'), userRoleController.create);

/**
 * @swagger
 * /user-role/{oid}:
 *   put:
 *     tags: [User Role]
 *     summary: Update an existing User Role entry
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
 *         description: User Role updated successfully
 */
router.put('/:oid', validateRequest(updateUserRoleDto), roleGuard('Admin'), userRoleController.update);

/**
 * @swagger
 * /user-role/delete/{oid}:
 *   delete:
 *     tags: [User Role]
 *     summary: Delete a User Role entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User Role deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteUserRoleDto), roleGuard('Admin'), userRoleController.remove);

/**
 * @swagger
 * /user-role:
 *   get:
 *     tags: [User Role]
 *     summary: Get all User Roles with optional filters
 *     parameters:
 *       - in: query
 *         name: userRoleCode
 *         schema:
 *           type: string
 *         description: Filter by userRoleCode
 *       - in: query
 *         name: userRoleName
 *         schema:
 *           type: string
 *         description: Filter by userRoleName
 *     responses:
 *       200:
 *         description: List of User Roles
 */
router.get('/', validateRequest(filterUserRoleDto), roleGuard('Admin'), userRoleController.findAll);

/**
 * @swagger
 * /user-role/no-auth:
 *   get:
 *     tags: [User Role]
 *     summary: Get all User Roles No Auth with optional filters
 *     parameters:
 *       - in: query
 *         name: userRoleCode
 *         schema:
 *           type: string
 *         description: Filter by userRoleCode
 *       - in: query
 *         name: userRoleName
 *         schema:
 *           type: string
 *         description: Filter by userRoleName
 *     responses:
 *       200:
 *         description: List of User Roles
 */
router.get('/no-auth',   userRoleController.findAll);


/**
 * @swagger
 * /user-role/q:
 *   post:
 *     tags: [User Role]
 *     summary: Paginate User Roles with filters
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
  *               userRoleCode:
 *                 type: string
 *                 example: "-"
 *               userRoleName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of User Roles
 */
router.post('/q', validateRequest(filterUserRoleDto), roleGuard('Admin'), userRoleController.find);

/**
 * @swagger
 * /user-role/{oid}:
 *   get:
 *     tags: [User Role]
 *     summary: Get a single User Role by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A User Role entry
 */

router.get('/:oid', validateRequest(getUserRoleDto), roleGuard('Admin'), userRoleController.findById);

module.exports = router;
