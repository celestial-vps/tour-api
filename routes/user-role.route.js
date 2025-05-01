const express = require('express');
const userRoleController = require('../controllers/user-role.controller'); // Adjust the path

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
 *     summary: Create a new user role
 *     description: Adds a new user role with specified permissions and attributes.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Admin3231x"
 *               targetType:
 *                 type: string
 *                 example: "Systemx"
 *               isAdministrative:
 *                 type: boolean
 *                 example: true
 *               readState:
 *                 type: boolean
 *                 example: true
 *               writeState:
 *                 type: boolean
 *                 example: true
 *               createState:
 *                 type: boolean
 *                 example: true
 *               deleteState:
 *                 type: boolean
 *                 example: true
 *               navigateState:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "xxx"
 *     responses:
 *       200:
 *         description: Successfully created the user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       format: uuid
 *                       example: "019224cd-2e81-7fd6-b754-4c966348afaf"
 *                     name:
 *                       type: string
 *                       example: "Admin3231x"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40000"
 *                 httpStatus:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/create',  userRoleController.create);
/**
 * @swagger
 * /user-role/{id}:
 *   put:
 *     summary: Update an existing user role
 *     description: Modifies the properties of an existing user role based on the provided ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user role to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "019224cd-2e81-7fd6-b754-4c966348afaf"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Admin3334y"
 *               targetType:
 *                 type: string
 *                 example: "Systemy"
 *               isAdministrative:
 *                 type: boolean
 *                 example: true
 *               readState:
 *                 type: boolean
 *                 example: true
 *               writeState:
 *                 type: boolean
 *                 example: true
 *               createState:
 *                 type: boolean
 *                 example: true
 *               deleteState:
 *                 type: boolean
 *                 example: true
 *               navigateState:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "xxx"
 *     responses:
 *       200:
 *         description: Successfully updated the user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       format: uuid
 *                       example: "019224cd-2e81-7fd6-b754-4c966348afaf"
 *                     name:
 *                       type: string
 *                       example: "Admin3334y"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40000"
 *                 httpStatus:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: User role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40400"
 *                 httpStatus:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "Role not found"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.put('/:oid',  userRoleController.update);
/**
 * @swagger
 * /user-role/delete/{id}:
 *   delete:
 *     summary: Delete a user role by ID
 *     description: Remove a specific user role using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the user role to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "01920086-0150-7be4-9733-23ff0ade6f59"
 *     responses:
 *       200:
 *         description: Successfully deleted the user role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       format: uuid
 *                       example: "01920086-0150-7be4-9733-23ff0ade6f59"
 *                     name:
 *                       type: string
 *                       example: "Admin31"
 *       404:
 *         description: User role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40400"
 *                 httpStatus:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User role not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.delete('/delete/:oid',  userRoleController.deleted);

/**
 * @swagger
 * /user-role:
 *   get:
 *     summary: Retrieve user roles by name
 *     description: Fetches a list of user roles available in the system filtered by role name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: roleName
 *         in: query
 *         required: false
 *         description: The name of the role to filter the results.
 *         schema:
 *           type: string
 *           example: "Admin"
 *     responses:
 *       200:
 *         description: User roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "01920086-0150-7be4-9733-23ff0ade6f59"
 *                       roleName:
 *                         type: string
 *                         example: "Admin31"
 *                       targetType:
 *                         type: string
 *                         example: "System"
 *                       isAdministrative:
 *                         type: integer
 *                         example: 1
 *                       readState:
 *                         type: integer
 *                         example: 1
 *                       writeState:
 *                         type: integer
 *                         example: 1
 *                       createState:
 *                         type: integer
 *                         example: 1
 *                       deleteState:
 *                         type: integer
 *                         example: 1
 *                       navigateState:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T15:07:15.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T15:07:15.000Z"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/',  userRoleController.findAll);

/**
 * @swagger
 * /user-role/q:
 *   post:
 *     summary: Query user roles
 *     description: Retrieve a list of user roles based on the specified search criteria.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "Admin"
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         description: The page index for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         description: The number of records per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of user roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 6
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "01920086-0150-7be4-9733-23ff0ade6f59"
 *                       roleName:
 *                         type: string
 *                         example: "Admin31"
 *                       targetType:
 *                         type: string
 *                         example: "System"
 *                       isAdministrative:
 *                         type: integer
 *                         example: 1
 *                       readState:
 *                         type: integer
 *                         example: 1
 *                       writeState:
 *                         type: integer
 *                         example: 1
 *                       createState:
 *                         type: integer
 *                         example: 1
 *                       deleteState:
 *                         type: integer
 *                         example: 1
 *                       navigateState:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T15:07:15.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-17T15:07:15.000Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40000"
 *                 httpStatus:
 *                   type: string
 *                   example: "400"
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/q',  userRoleController.find);
/**
 * @swagger
 * /user-role/{id}:
 *   get:
 *     summary: Get a user role by ID
 *     description: Retrieve detailed information about a specific user role using its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the user role
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "019224cd-2e81-7fd6-b754-4c966348afaf"
 *     responses:
 *       200:
 *         description: Successfully retrieved the user role details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "20000"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "019224cd-2e81-7fd6-b754-4c966348afaf"
 *                     roleName:
 *                       type: string
 *                       example: "Admin3334y"
 *                     targetType:
 *                       type: string
 *                       example: "Systemy"
 *                     isAdministrative:
 *                       type: integer
 *                       example: 1
 *                     readState:
 *                       type: integer
 *                       example: 1
 *                     writeState:
 *                       type: integer
 *                       example: 1
 *                     createState:
 *                       type: integer
 *                       example: 1
 *                     deleteState:
 *                       type: integer
 *                       example: 1
 *                     navigateState:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-24T16:11:19.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-24T16:15:16.000Z"
 *       404:
 *         description: User role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40400"
 *                 httpStatus:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: "User role not found"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40100"
 *                 httpStatus:
 *                   type: string
 *                   example: "401"
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/:oid',  userRoleController.findById);


module.exports = router;