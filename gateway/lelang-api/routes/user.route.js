const express = require('express');
const userController = require('../controllers/user.controller'); // sesuaikan path
const {roleGuard} = require('../middleware/role-guard');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         oid:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         birthday:
 *           type: string
 *           format: date
 *           nullable: true
 *         memberNumber:
 *           type: string
 *           nullable: true
 *         androidToken:
 *           type: string
 *           nullable: true
 *         expiredTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         activatedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserCreate:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *           nullable: true
 *         memberNumber:
 *           type: string
 *           nullable: true
 *         androidToken:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         roleOid:
 *           type: string
 *           format: uuid
 *         activatedAt:
 *           type: string
 *           format: date
 *           nullable: true
 *     UserUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *           nullable: true
 *         memberNumber:
 *           type: string
 *           nullable: true
 *         androidToken:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         roleOid:
 *           type: string
 *           format: uuid
 *         activatedAt:
 *           type: string
 *           format: date
 *           nullable: true
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       200:
 *         description: User created successfully
 */
router.post('/', roleGuard('Admin'), userController.create);

/**
 * @swagger
 * /user/{oid}:
 *   put:
 *     summary: Update user by OID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:oid', roleGuard('Admin'), userController.update);

/**
 * @swagger
 * /user/{oid}:
 *   delete:
 *     summary: Delete a user by OID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:oid', roleGuard('Admin'), userController.deleted);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve users with optional filtering and pagination
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *       - name: email
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/', roleGuard('Admin'), userController.find);

/**
 * @swagger
 * /user/{oid}:
 *   get:
 *     summary: Retrieve a single user by OID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User retrieved successfully
 */
router.get('/:oid', roleGuard('Admin'), userController.findById);

module.exports = router;
