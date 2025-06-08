// const express = require('express');
// const userController = require('../controllers/user.controller'); // Adjust the path

// const router = express.Router(); 

// /**
//  * @swagger
//  * tags:
//  *   - name: User
//  *     description: User management operations
//  */

// /**
//  * @swagger
//  * /user/create:
//  *   post:
//  *     summary: Create a new user
//  *     description: Adds a new user to the database.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       description: User object that needs to be added
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "aioria"
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 example: "aioria@gmail.com"
//  *               password:
//  *                 type: string
//  *                 example: "abcdefgh123"
//  *               birthday:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-08-16"
//  *               memberNumber:
//  *                 type: string
//  *                 example: "123456"
//  *               androidToken:
//  *                 type: string
//  *                 example: "1234556666"
//  *               isActive:
//  *                 type: boolean
//  *                 example: false
//  *               roleOid:
//  *                 type: string
//  *                 example: "ebb0475f-34ce-4057-8ba6-7579d58a284d"
//  *               activatedAt:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-08-16"
//  *     responses:
//  *       200:
//  *         description: User created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     value:
//  *                       type: string
//  *                       example: "0192273f-aa53-72db-a750-d3ba7bcada74"
//  *                     name:
//  *                       type: string
//  *                       example: "aioria@gmail.com"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */
// router.post('/create',  userController.create); 
// /**
//  * @swagger
//  * /user/{oid}:
//  *   put:
//  *     summary: Update user information
//  *     description: Update the details of a specific user by their unique identifier (OID).
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         description: The unique identifier of the user
//  *         schema:
//  *           type: string
//  *           example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "aioria"
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 example: "aioria1@gmail.com"
//  *               password:
//  *                 type: string
//  *                 example: "abcdefgh1"
//  *               birthday:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-08-16"
//  *               memberNumber:
//  *                 type: string
//  *                 example: "123456"
//  *               androidToken:
//  *                 type: string
//  *                 example: "1234556666"
//  *               isActive:
//  *                 type: boolean
//  *                 example: false
//  *               roleOid:
//  *                 type: string
//  *                 example: "ebb0475f-34ce-4057-8ba6-7579d58a284d"
//  *               activatedAt:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-08-16"
//  *     responses:
//  *       200:
//  *         description: Successfully updated user information
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     value:
//  *                       type: string
//  *                       example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *                     name:
//  *                       type: string
//  *                       example: "aioria1@gmail.com"
//  *       400:
//  *         description: Bad Request
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "400"
//  *                 message:
//  *                   type: string
//  *                   example: "Invalid input"
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40100"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "401"
//  *                 message:
//  *                   type: string
//  *                   example: "Unauthorized"
//  *       404:
//  *         description: User not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40400"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "404"
//  *                 message:
//  *                   type: string
//  *                   example: "User not found"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */

// router.put('/:oid',  userController.update); 
// /**
//  * @swagger
//  * /user/delete/{oid}:
//  *   delete:
//  *     summary: Delete a user
//  *     description: Remove a user from the system by their unique identifier (OID).
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         description: The unique identifier of the user to delete
//  *         schema:
//  *           type: string
//  *           example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *     responses:
//  *       200:
//  *         description: Successfully deleted the user
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     value:
//  *                       type: string
//  *                       example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *                     name:
//  *                       type: string
//  *                       example: "aioria1@gmail.com"
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40100"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "401"
//  *                 message:
//  *                   type: string
//  *                   example: "Unauthorized"
//  *       404:
//  *         description: User not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40400"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "404"
//  *                 message:
//  *                   type: string
//  *                   example: "User not found"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */
// router.delete('/delete/:oid',  userController.deleted); 
// /**
//  * @swagger
//  * /user/q:
//  *   get:
//  *     summary: Query users with pagination
//  *     description: Retrieves a list of users based on the specified pagination parameters.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: pageIndex
//  *         in: query
//  *         required: true
//  *         description: The index of the page to retrieve.
//  *         schema:
//  *           type: integer
//  *           example: 1
//  *       - name: pageSize
//  *         in: query
//  *         required: true
//  *         description: The number of records to retrieve per page.
//  *         schema:
//  *           type: integer
//  *           example: 10
//  *     requestBody:
//  *       description: Optional filter for user email
//  *       required: false
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 example: "weslyaioria1@gmail.com"
//  *     responses:
//  *       200:
//  *         description: Users retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       oid:
//  *                         type: string
//  *                         format: uuid
//  *                         example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *                       name:
//  *                         type: string
//  *                         example: ""
//  *                       email:
//  *                         type: string
//  *                         format: email
//  *                         example: "weslyaioria1@gmail.com"
//  *                       birthday:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       memberNumber:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       androidToken:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       expiredTime:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       isActive:
//  *                         type: integer
//  *                         example: 0
//  *                       activatedAt:
//  *                         type: string
//  *                         example: "Invalid date"
//  *                       createdAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T15:44:21.000Z"
//  *                       updatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T15:44:21.000Z"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */
// router.get('/',  userController.findAll); 
// /**
//  * @swagger
//  * /user/q:
//  *   get:
//  *     summary: Retrieve users with pagination and filter
//  *     description: Get a list of users with optional email filtering and pagination.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: pageIndex
//  *         in: query
//  *         required: true
//  *         description: The page index for pagination
//  *         schema:
//  *           type: integer
//  *           example: 1
//  *       - name: pageSize
//  *         in: query
//  *         required: true
//  *         description: The number of users per page
//  *         schema:
//  *           type: integer
//  *           example: 10
//  *       - name: email
//  *         in: query
//  *         required: false
//  *         description: Filter users by their email address
//  *         schema:
//  *           type: string
//  *           example: "weslyaioria1@gmail.com"
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved user(s)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       oid:
//  *                         type: string
//  *                         format: uuid
//  *                         example: "019200a7-faec-79c2-8428-77ff2242d829"
//  *                       name:
//  *                         type: string
//  *                         example: ""
//  *                       email:
//  *                         type: string
//  *                         format: email
//  *                         example: "weslyaioria1@gmail.com"
//  *                       birthday:
//  *                         type: string
//  *                         format: date
//  *                         nullable: true
//  *                         example: null
//  *                       memberNumber:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       androidToken:
//  *                         type: string
//  *                         nullable: true
//  *                         example: null
//  *                       expiredTime:
//  *                         type: string
//  *                         format: date-time
//  *                         nullable: true
//  *                         example: null
//  *                       isActive:
//  *                         type: integer
//  *                         example: 0
//  *                       activatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "Invalid date"
//  *                       createdAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T15:44:21.000Z"
//  *                       updatedAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-09-17T15:44:21.000Z"
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40100"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "401"
//  *                 message:
//  *                   type: string
//  *                   example: "Unauthorized"
//  *       404:
//  *         description: Users not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "40400"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "404"
//  *                 message:
//  *                   type: string
//  *                   example: "No users found"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */
// router.post('/q',  userController.find); 
// /**
//  * @swagger
//  * /user/{id}:
//  *   get:
//  *     summary: Retrieve a user by ID
//  *     description: Fetches the details of a specific user based on the provided user ID.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: The ID of the user to retrieve.
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *           example: "019224db-edbd-7d7b-8db9-bedbf516da2e"
//  *     responses:
//  *       200:
//  *         description: User retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 resultCode:
//  *                   type: string
//  *                   example: "20000"
//  *                 httpStatus:
//  *                   type: string
//  *                   example: "200"
//  *                 message:
//  *                   type: string
//  *                   example: "success"
//  *                 total:
//  *                   type: integer
//  *                   example: 1
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     oid:
//  *                       type: string
//  *                       format: uuid
//  *                       example: "019224db-edbd-7d7b-8db9-bedbf516da2e"
//  *                     name:
//  *                       type: string
//  *                       example: "aioria"
//  *                     email:
//  *                       type: string
//  *                       format: email
//  *                       example: "weslyaioria@gmail.com"
//  *                     birthday:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-08-15T17:00:00.000Z"
//  *                     memberNumber:
//  *                       type: string
//  *                       example: "123456"
//  *                     androidToken:
//  *                       type: string
//  *                       example: "1234556666"
//  *                     expiredTime:
//  *                       type: string
//  *                       nullable: true
//  *                       example: null
//  *                     isActive:
//  *                       type: integer
//  *                       example: 0
//  *                     activatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-08-16T00:00:00+07:00"
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-09-24T16:27:26.000Z"
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: "2024-09-24T16:27:26.000Z"
//  * components:
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */
// router.get('/:oid',  userController.findById);


// module.exports = router;