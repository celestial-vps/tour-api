const express = require('express');
const itemCategoryController = require('../controllers/item-category.controller');
const {roleGuard} = require('../middleware/role-guard');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Item Category
 *     description: ItemCategory management
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     ItemCategory:
 *       type: object
 *       properties:
 *         oid:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         imageOid:
 *           type: string
 *         createdBy:
 *           type: string
 *           nullable: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ItemCategoryCreateDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         imageOid:
 *           type: string
 *     ApiResponse:
 *       type: object
 *       properties:
 *         resultCode:
 *           type: string
 *         httpStatus:
 *           type: string
 *         message:
 *           type: string
 *         total:
 *           type: integer
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/ItemCategory'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemCategory'
 */

/**
 * @swagger
 * /itemCategory/create:
 *   post:
 *     tags: [ItemCategory]
 *     summary: Create a new itemCategory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCategoryCreateDto'
 *     responses:
 *       200:
 *         description: ItemCategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/create', roleGuard('Admin'), itemCategoryController.create);

/**
 * @swagger
 * /itemCategory/{oid}:
 *   put:
 *     tags: [ItemCategory]
 *     summary: Update an itemCategory
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
 *             $ref: '#/components/schemas/ItemCategoryCreateDto'
 *     responses:
 *       200:
 *         description: ItemCategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:oid', roleGuard('Admin'), itemCategoryController.update);

/**
 * @swagger
 * /itemCategory/delete/{oid}:
 *   delete:
 *     tags: [ItemCategory]
 *     summary: Delete an itemCategory
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
 *         description: ItemCategory deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/delete/:oid', roleGuard('Admin'), itemCategoryController.remove);

/**
 * @swagger
 * /itemCategory:
 *   get:
 *     tags: [ItemCategory]
 *     summary: Retrieve all itemCategory entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of itemCategory entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', roleGuard('Admin'), itemCategoryController.findAll);

/**
 * @swagger
 * /itemCategory/q:
 *   post:
 *     tags: [ItemCategory]
 *     summary: Query itemCategory entries with pagination
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paginated list of itemCategory entries
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/q', roleGuard('Admin'), itemCategoryController.find);

/**
 * @swagger
 * /itemCategory/{oid}:
 *   get:
 *     tags: [ItemCategory]
 *     summary: Retrieve an itemCategory by ID
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
 *         description: ItemCategory retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:oid', roleGuard('Admin'), itemCategoryController.findById);

module.exports = router;
