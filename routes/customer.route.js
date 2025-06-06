const express = require('express');
const customerController = require('../controllers/customer.controller');
const { validateRequest } = require('../misc/validation');
const { roleGuard } = require('../middleware/role-guard');
const {
  createCustomerRequestDto,
  updateCustomerRequestDto,
  deleteCustomerDto,
  getCustomerDto,
  filterCustomerDto
} = require('../dtos/customer.dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Customer
 *     description: Customer management endpoints
 */

/**
 * @swagger
 * /customer/create:
 *   post:
 *     tags: [Customer]
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - customerEmail
 *               - customerPostalCode
 *               - bankOid
 *               - subDistrictOid
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: "John Doe"
 *               customerPhone:
 *                 type: string
 *                 example: "+62123456789"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               customerPostalCode:
 *                 type: string
 *                 example: "12345"
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *                 example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *               subDistrictOid:
 *                 type: string
 *                 format: uuid
 *                 example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       200:
 *         description: Customer created successfully
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
 *                       example: "d290f1ee-6c54-4b01-90e6-d701748f0851"
 *                     customerName:
 *                       type: string
 *                       example: "John Doe"
 *                     customerPhone:
 *                       type: string
 *                       example: "+62123456789"
 *                     customerEmail:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     customerPostalCode:
 *                       type: string
 *                       example: "12345"
 *                     bankOid:
 *                       type: string
 *                       format: uuid
 *                     subDistrictOid:
 *                       type: string
 *                       format: uuid
 */
router.post('/create', validateRequest(createCustomerRequestDto), roleGuard('Admin'), customerController.create);

/**
 * @swagger
 * /customer/{oid}:
 *   put:
 *     tags: [Customer]
 *     summary: Update customer by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the customer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerPhone
 *               - customerEmail
 *               - customerPostalCode
 *               - bankOid
 *               - subDistrictOid
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: "Jane Doe"
 *               customerPhone:
 *                 type: string
 *                 example: "+62123456789"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               customerPostalCode:
 *                 type: string
 *                 example: "54321"
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *               subDistrictOid:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Customer updated successfully
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
router.put('/:oid', validateRequest(updateCustomerRequestDto), roleGuard('Admin'), customerController.update);

/**
 * @swagger
 * /customer/delete/{oid}:
 *   delete:
 *     tags: [Customer]
 *     summary: Delete customer by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the customer to delete
 *     responses:
 *       200:
 *         description: Customer deleted successfully
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
router.delete('/delete/:oid', validateRequest(deleteCustomerDto), roleGuard('Admin'), customerController.delete);

/**
 * @swagger
 * /customer/{oid}:
 *   get:
 *     tags: [Customer]
 *     summary: Get customer by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the customer to retrieve
 *     responses:
 *       200:
 *         description: Customer data
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
 *                     customerName:
 *                       type: string
 *                     customerPhone:
 *                       type: string
 *                     customerEmail:
 *                       type: string
 *                     customerPostalCode:
 *                       type: string
 *                     bankOid:
 *                       type: string
 *                       format: uuid
 *                     subDistrictOid:
 *                       type: string
 *                       format: uuid
 */
router.get('/:oid', validateRequest(getCustomerDto), roleGuard('Admin'), customerController.findById);

/**
 * @swagger
 * /customer:
 *   get:
 *     tags: [Customer]
 *     summary: Get list of customers with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         required: true
 *         description: Number of records per page
 *     requestBody:
 *       description: Filter parameters (optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: "John"
 *               customerPhone:
 *                 type: string
 *                 example: "+62123456789"
 *               customerEmail:
 *                 type: string
 *                 example: "john@example.com"
 *               customerPostalCode:
 *                 type: string
 *                 example: "12345"
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *               subDistrictOid:
 *                 type: string
 *                 format: uuid
 *               fieldName:
 *                 type: string
 *                 example: "customerName"
 *               sortOrder:
 *                 type: integer
 *                 enum: [-1, 0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of customers
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
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid:
 *                         type: string
 *                         format: uuid
 *                       customerName:
 *                         type: string
 *                       customerPhone:
 *                         type: string
 *                       customerEmail:
 *                         type: string
 *                       customerPostalCode:
 *                         type: string
 *                       bankOid:
 *                         type: string
 *                         format: uuid
 *                       subDistrictOid:
 *                         type: string
 *                         format: uuid
 */
router.get('/', validateRequest(filterCustomerDto), roleGuard('Admin'), customerController.findAll);

module.exports = router;
