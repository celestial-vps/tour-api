const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const billingController = require('../controllers/billing.controller');
const { validateRequest } = require('../misc/validation');
const j2s = require('joi-to-swagger');

const {
  createBillingDto,
  updateBillingDto,
  deleteBillingDto,
  filterBillingDto,
  getBillingDto
} = require('../dtos/payload-billing-dto');

const router = express.Router();

// Swagger schemas from DTO
const { swagger: createBillingSchema } = j2s(createBillingDto);
const { swagger: updateBillingSchema } = j2s(updateBillingDto);
const { swagger: filterBillingSchema } = j2s(filterBillingDto);

/**
 * @swagger
 * tags:
 *   - name: Billing
 *     description: Billing management operations
 */

/**
 * @swagger
 * /billing/create:
 *   post:
 *     tags: [Billing]
 *     summary: Create a new billing entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientOid:
 *                 type: string
 *                 example: "uuid-patient-123"
 *               totalAmount:
 *                 type: number
 *                 example: 150000.00
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Paid", "Cancelled"]
 *                 example: "Pending"
 *     responses:
 *       200:
 *         description: Billing created successfully
 */
router.post('/create', validateRequest(createBillingDto), roleGuard('Admin'), billingController.create);

/**
 * @swagger
 * /billing/{oid}:
 *   put:
 *     tags: [Billing]
 *     summary: Update an existing billing entry
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
 *             type: object
 *             properties:
 *               patientOid:
 *                 type: string
 *                 example: "uuid-patient-123"
 *               totalAmount:
 *                 type: number
 *                 example: 200000.00
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Paid", "Cancelled"]
 *                 example: "Paid"
 *     responses:
 *       200:
 *         description: Billing updated successfully
 */
router.put('/:oid', validateRequest(updateBillingDto), roleGuard('Admin'), billingController.update);

/**
 * @swagger
 * /billing/delete/{oid}:
 *   delete:
 *     tags: [Billing]
 *     summary: Delete a billing entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Billing deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteBillingDto), roleGuard('Admin'), billingController.remove);

/**
 * @swagger
 * /billing:
 *   get:
 *     tags: [Billing]
 *     summary: Get all billings
 *     responses:
 *       200:
 *         description: List of billings
 */
router.get('/', validateRequest(filterBillingDto), roleGuard('Admin'), billingController.findAll);

/**
 * @swagger
 * /billing/q:
 *   post:
 *     tags: [Billing]
 *     summary: Paginate billings
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientOid:
 *                 type: string
 *                 example: "uuid-patient-123"
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Paid", "Cancelled"]
 *                 example: "Pending"
 *     responses:
 *       200:
 *         description: Paginated list of billings
 */
router.post('/q', validateRequest(filterBillingDto), roleGuard('Admin'), billingController.find);

/**
 * @swagger
 * /billing/{oid}:
 *   get:
 *     tags: [Billing]
 *     summary: Get a single billing by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A billing entry
 */
router.get('/:oid', validateRequest(getBillingDto), roleGuard('Admin'), billingController.findById);

module.exports = router;
