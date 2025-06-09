const express = require('express');
const authController = require('../../controllers/auth.controller'); // Adjust the path

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Auth management operations
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns an access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "weslyaioria@gmail.com"
 *               password:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: A successful login response
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
 *                       example: "80366f9e-8600-4e37-867f-2e687f5ed14a"
 *                     email:
 *                       type: string
 *                       example: "weslyaioria@gmail.com"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: ""
 *                     isActive:
 *                       type: boolean
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-14T09:56:45.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-09-14T09:56:45.000Z"
 *       400:
 *         description: Bad Request
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
 *                   example: "Invalid email or password"
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
 *                   example: "Access denied"
 */

router.post('/login',  authController.login);
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a new user to register by providing an email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "weslyaioria22@gmail.com"
 *               password:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description: A successful response indicating user registration
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
 *                       example: "019223c4-645d-7f4d-9f9b-04a43ae1401f"
 *                     name:
 *                       type: string
 *                       example: "weslyaioria22@gmail.com"
 *       400:
 *         description: Bad Request
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
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "40900"
 *                 httpStatus:
 *                   type: string
 *                   example: "409"
 *                 message:
 *                   type: string
 *                   example: "Email already exists"
 */
router.post('/register',  authController.register);

module.exports = router;