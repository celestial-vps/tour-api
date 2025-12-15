const express = require('express');
const userController = require('../controllers/user.controller');
const { roleGuard } = require('../middleware/role-guard');
const { validateRequest } = require('../misc/validation');
const { 
  createUserDto, 
  updateUserDto, 
  deleteUserDto, 
  filterUserDto, 
  getUserDto 
} = require('../dtos/payload-user-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management operations
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     description: Adds a new user to the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: 
 *               email:
 *                 type: string
 *                 example: "john.doe@gmail.com"
 *               password:
 *                 type: string
 *                 example: "MyPassword123"
 *               androidToken:
 *                 type: string
 *                 example: "device-token-123"
 *               roleOid:
 *                 type: string
 *                 example: "7c1c03b3-469d-4a0c-afeb-19d1c8a314c1"
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post('/create', validateRequest(createUserDto), roleGuard('Admin'), userController.create);

/**
 * @swagger
 * /user/{oid}:
 *   put:
 *     summary: Update user information
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *         example: "2b58bfc7-0327-42d5-a7db-2aa2e5a57eae"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updated.email@gmail.com"
 *               password:
 *                 type: string
 *                 example: "NewPassword123"
 *               androidToken:
 *                 type: string
 *                 example: "updated-device-token"
 *               roleOid:
 *                 type: string
 *                 example: "1bbbaaf6-6f5e-4599-b869-44c3b6271c9c"
 *     responses:
 *       200:
 *         description: Successfully updated user
 */
router.put('/:oid', validateRequest(updateUserDto), roleGuard('Admin'), userController.update);

/**
 * @swagger
 * /user/delete/{oid}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *         example: "f9e3fb23-2d21-4b30-8f47-abf120bd1b52"
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/delete/:oid', validateRequest(deleteUserDto), roleGuard('Admin'), userController.remove);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *       - name: customerOid
 *         in: query
 *         schema:
 *           type: string
 *         example: ""
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', validateRequest(filterUserDto), roleGuard('Admin'), userController.findAll);

/**
 * @swagger
 * /user/q:
 *   post:
 *     summary: Query users with pagination & filter
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *         example: 20
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerOid:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Query results
 */
router.post('/q', validateRequest(filterUserDto), roleGuard('Admin'), userController.find);

/**
 * @swagger
 * /user/profile/me:
 *   get:
 *     summary: Get current authenticated user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile information
 */
router.get('/profile/me', roleGuard('Admin'), userController.getProfile);

/**
 * @swagger
 * /user/{oid}:
 *   get:
 *     summary: Retrieve user by OID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "cb9f703f-3ad7-4afe-b48c-f32b87b14c1d"
 *     responses:
 *       200:
 *         description: User found
 */
router.get('/:oid', validateRequest(getUserDto), roleGuard('Admin'), userController.findById);

module.exports = router;
