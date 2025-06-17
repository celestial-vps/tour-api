const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const customerController = require('../controllers/customer.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterCustomerDto,
  createCustomerDto,
  updateCustomerDto,
  deleteCustomerDto,
  getCustomerDto
} = require('../dtos/payload-customer-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Customer
 *     description: Customer management operations
 */

/**
 * @swagger
 * /customer/create:
 *   post:
 *     tags: [Customer]
 *     summary: Create a new customer entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              customerName:
 *                type: string
 *                example: "-"
 *              customerPhone:
 *                type: string
 *                example: "-"
 *              customerEmail:
 *                type: string
 *                example: "-"
 *              customerPostalCode:
 *                type: string
 *                example: "-"
 *              bankOid:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Customer created successfully
 */
router.post('/create', validateRequest(createCustomerDto), roleGuard('Admin'), customerController.create);

/**
 * @swagger
 * /customer/{oid}:
 *   put:
 *     tags: [Customer]
 *     summary: Update an existing customer entry
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

 *     responses:
 *       200:
 *         description: Customer updated successfully
 */
router.put('/:oid', validateRequest(updateCustomerDto), roleGuard('Admin'), customerController.update);

/**
 * @swagger
 * /customer/delete/{oid}:
 *   delete:
 *     tags: [Customer]
 *     summary: Delete a customer entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteCustomerDto), roleGuard('Admin'), customerController.remove);

/**
 * @swagger
 * /customer:
 *   get:
 *     tags: [Customer]
 *     summary: Get all customers with optional filters
 *     parameters:
 *       - in: query
 *         name: customerCode
 *         schema:
 *           type: string
 *         description: Filter by customerCode
 *       - in: query
 *         name: customerName
 *         schema:
 *           type: string
 *         description: Filter by customerName
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/', validateRequest(filterCustomerDto), roleGuard('Admin'), customerController.findAll);

/**
 * @swagger
 * /customer/q:
 *   post:
 *     tags: [Customer]
 *     summary: Paginate customers with filters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageIndex:
 *                 type: integer
 *                 example: 1
 *               pageSize:
 *                 type: integer
 *                 example: 10
  *               customerCode:
 *                 type: string
 *                 example: "-"
 *               customerName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of customers
 */
router.post('/q', validateRequest(filterCustomerDto), roleGuard('Admin'), customerController.find);
/**
 * @swagger
 * /customer/{oid}:
 *   get:
 *     tags: [Customer]
 *     summary: Get a single customer by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A customer entry
 */

router.get('/:oid', validateRequest(getCustomerDto), roleGuard('Admin'), customerController.findById);

module.exports = router;
