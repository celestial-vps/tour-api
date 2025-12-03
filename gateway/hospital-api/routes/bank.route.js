const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const bankController = require('../controllers/bank.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');
const {
  filterBankDto,
  createBankDto,
  updateBankDto,
  deleteBankDto,
  getBankDto
} = require('../dtos/payload-bank-dto');

const router = express.Router();

// Convert DTO ke Swagger schema
const { swagger: createBankSchema } = j2s(createBankDto);
const { swagger: updateBankSchema } = j2s(updateBankDto);
const { swagger: filterBankSchema } = j2s(filterBankDto); // hanya body
// getBankDto & deleteBankDto biasanya hanya params, bisa manual di Swagger

/**
 * @swagger
 * tags:
 *   - name: Bank
 *     description: Bank management operations
 */

/**
 * @swagger
 * /bank/create:
 *   post:
 *     tags: [Bank]
 *     summary: Create a new bank entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             ${JSON.stringify(createBankSchema)}
 *     responses:
 *       200:
 *         description: Bank created successfully
 */
router.post('/create', validateRequest(createBankDto), roleGuard('Admin'), bankController.create);

/**
 * @swagger
 * /bank/{oid}:
 *   put:
 *     tags: [Bank]
 *     summary: Update an existing bank entry
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
 *             ${JSON.stringify(updateBankSchema)}
 *     responses:
 *       200:
 *         description: Bank updated successfully
 */
router.put('/:oid', validateRequest(updateBankDto), roleGuard('Admin'), bankController.update);

/**
 * @swagger
 * /bank/delete/{oid}:
 *   delete:
 *     tags: [Bank]
 *     summary: Delete a bank entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bank deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteBankDto), roleGuard('Admin'), bankController.remove);

/**
 * @swagger
 * /bank:
 *   get:
 *     tags: [Bank]
 *     summary: Get all banks
 *     responses:
 *       200:
 *         description: List of banks
 */
router.get('/', validateRequest(filterBankDto), roleGuard('Admin'), bankController.findAll);

/**
 * @swagger
 * /bank/q:
 *   post:
 *     tags: [Bank]
 *     summary: Paginate banks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             ${JSON.stringify(filterBankSchema)}
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list of banks
 */
router.post('/q', validateRequest(filterBankDto), roleGuard('Admin'), bankController.find);

/**
 * @swagger
 * /bank/{oid}:
 *   get:
 *     tags: [Bank]
 *     summary: Get a single bank by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A bank entry
 */
router.get('/:oid', validateRequest(getBankDto), roleGuard('Admin'), bankController.findById);

module.exports = router;
