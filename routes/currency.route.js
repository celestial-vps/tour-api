const express = require('express');
const currencyController = require('../controllers/currency.controller');
const { validateRequest } = require('../misc/validation');
const { roleGuard } = require('../middleware/role-guard');
const {
  createCurrencyRequestDto,
  updateCurrencyRequestDto,
  deleteCurrencyDto,
  getCurrencyDto,
  filterCurrencyDto
} = require('../dtos/currency.dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Currency
 *     description: Currency management endpoints
 */

/**
 * @swagger
 * /currency/create:
 *   post:
 *     tags: [Currency]
 *     summary: Create a new currency
 *     description: Adds a new currency record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currencyName:
 *                 type: string
 *                 example: "US Dollar"
 *               currencySymbol:
 *                 type: string
 *                 example: "$"
 *     responses:
 *       200:
 *         description: Currency created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *                     currencyName:
 *                       type: string
 *                       example: "US Dollar"
 *                     currencySymbol:
 *                       type: string
 *                       example: "$"
 */
router.post('/create', validateRequest(createCurrencyRequestDto), roleGuard('Admin'), currencyController.create);

/**
 * @swagger
 * /currency/{oid}:
 *   put:
 *     tags: [Currency]
 *     summary: Update a currency by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: Currency UUID to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currencyName:
 *                 type: string
 *                 example: "Euro"
 *               currencySymbol:
 *                 type: string
 *                 example: "€"
 *     responses:
 *       200:
 *         description: Currency updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *                     currencyName:
 *                       type: string
 *                       example: "Euro"
 *                     currencySymbol:
 *                       type: string
 *                       example: "€"
 */
router.put('/:oid', validateRequest(updateCurrencyRequestDto), roleGuard('Admin'), currencyController.update);

/**
 * @swagger
 * /currency/delete/{oid}:
 *   delete:
 *     tags: [Currency]
 *     summary: Delete a currency by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: Currency UUID to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *     responses:
 *       200:
 *         description: Currency deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 */
router.delete('/delete/:oid', validateRequest(deleteCurrencyDto), roleGuard('Admin'), currencyController.delete);

/**
 * @swagger
 * /currency/{oid}:
 *   get:
 *     tags: [Currency]
 *     summary: Get a currency by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: Currency UUID to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *     responses:
 *       200:
 *         description: Currency retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid:
 *                       type: string
 *                       format: uuid
 *                       example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *                     currencyName:
 *                       type: string
 *                       example: "US Dollar"
 *                     currencySymbol:
 *                       type: string
 *                       example: "$"
 */
router.get('/:oid', validateRequest(getCurrencyDto), roleGuard('Admin'), currencyController.findById);

/**
 * @swagger
 * /currency:
 *   get:
 *     tags: [Currency]
 *     summary: Get paginated and filtered list of currencies
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         description: Page number starting from 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Number of items per page
 *     requestBody:
 *       description: Filter and sort options
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currencyName:
 *                 type: string
 *                 example: "Dollar"
 *               currencySymbol:
 *                 type: string
 *                 example: "$"
 *               fieldName:
 *                 type: string
 *                 example: "currencyName"
 *               sortOrder:
 *                 type: integer
 *                 enum: [-1, 0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of currencies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 httpStatus:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 total:
 *                   type: integer
 *                   example: 15
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-5678-90ef-gh12-345678ijklmn"
 *                       currencyName:
 *                         type: string
 *                         example: "US Dollar"
 *                       currencySymbol:
 *                         type: string
 *                         example: "$"
 */
router.get('/', validateRequest(filterCurrencyDto), roleGuard('Admin'), currencyController.findAll);

module.exports = router;
