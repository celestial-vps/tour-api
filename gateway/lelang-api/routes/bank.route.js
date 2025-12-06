const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const bankController = require('../controllers/bank.controller');
const { validateRequest } = require('../misc/validation');
const { createBankDto } = require('../dtos/payload-bank-dto');

const router = express.Router();

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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankCode
 *               - bankName
 *             properties:
 *               bankCode:
 *                 type: string
 *                 example: BCA001
 *               bankName:
 *                 type: string
 *                 example: Bank Central Asia
 *               shortName:
 *                 type: string
 *                 example: BCA
 *               description:
 *                 type: string
 *                 example: Bank description
 *     responses:
 *       200:
 *         description: Bank created successfully
 */

router.post(
  '/create',
  validateRequest(createBankDto), // tetap pakai DTO lengkap termasuk headers
  roleGuard('Admin'),
  bankController.create
);

module.exports = router; // **Hanya ekspor router**
