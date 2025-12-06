const express = require('express');
const itemController = require('../controllers/item.controller');
const {roleGuard} = require('../middleware/role-guard');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Item
 *     description: Item management
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Item:
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
 *     ItemCreateDto:
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
 *             - $ref: '#/components/schemas/Item'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */

/**
 * @swagger
 * /item/create:
 *   post:
 *     tags: [Item]
 *     summary: Create a new item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemCreateDto'
 *     responses:
 *       200:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/create', roleGuard('Admin'), itemController.create);

/**
 * @swagger
 * /item/{oid}:
 *   put:
 *     tags: [Item]
 *     summary: Update an item
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
 *             $ref: '#/components/schemas/ItemCreateDto'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:oid', roleGuard('Admin'), itemController.update);

/**
 * @swagger
 * /item/delete/{oid}:
 *   delete:
 *     tags: [Item]
 *     summary: Delete an item
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
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/delete/:oid', roleGuard('Admin'), itemController.remove);

/**
 * @swagger
 * /item:
 *   get:
 *     tags: [Item]
 *     summary: Retrieve all items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', roleGuard('Admin'), itemController.findAll);

/**
 * @swagger
 * /item/q:
 *   post:
 *     tags: [Item]
 *     summary: Query items with pagination
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
 *         description: Paginated list of items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/q', roleGuard('Admin'), itemController.find);

/**
 * @swagger
 * /item/{oid}:
 *   get:
 *     tags: [Item]
 *     summary: Retrieve an item by ID
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
 *         description: Item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:oid', roleGuard('Admin'), itemController.findById);

module.exports = router;
