const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const bankBranchController = require('../controllers/bank-branch.controller'); // Sesuaikan path-nya
const { validateRequest } = require('../misc/validation');
const { 
  createBankBranchRequestDto, 
  updateBankBranchRequestDto, 
  deleteBankBranchDto, 
  filterBankBranchDto, 
  getBankBranchDto 
} = require('../dtos/payload-bank-branch-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: BankBranch
 *     description: Bank branch management operations
 */

/**
 * @swagger
 * /bankbranch/create:
 *   post:
 *     tags: [BankBranch]
 *     summary: Create a new bank branch
 *     description: Adds a new bank branch to the system.
 *     requestBody:
 *       description: Bank branch object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankOid
 *               - branchName
 *               - bankAddress
 *             properties:
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *                 example: "01920370-1523-78ec-8a88-9b01fe874882"
 *               branchName:
 *                 type: string
 *                 example: "Central Branch"
 *               bankAddress:
 *                 type: string
 *                 example: "123 Main St, Cityville"
 *     responses:
 *       200:
 *         description: Bank branch created successfully
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
 *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
 *                     bankOid:
 *                       type: string
 *                       format: uuid
 *                       example: "01920370-1523-78ec-8a88-9b01fe874882"
 *                     branchName:
 *                       type: string
 *                       example: "Central Branch"
 *                     bankAddress:
 *                       type: string
 *                       example: "123 Main St, Cityville"
 */
router.post('/create', validateRequest(createBankBranchRequestDto), roleGuard('Admin'), bankBranchController.create);

/**
 * @swagger
 * /bankbranch/{oid}:
 *   put:
 *     tags: [BankBranch]
 *     summary: Update a bank branch
 *     description: Updates an existing bank branch by oid.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: UUID of the bank branch to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     requestBody:
 *       description: Bank branch object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankOid
 *               - branchName
 *               - bankAddress
 *             properties:
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *                 example: "01920370-1523-78ec-8a88-9b01fe874882"
 *               branchName:
 *                 type: string
 *                 example: "Updated Branch Name"
 *               bankAddress:
 *                 type: string
 *                 example: "456 New Address, Cityville"
 *     responses:
 *       200:
 *         description: Bank branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
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
 *                     bankOid:
 *                       type: string
 *                       format: uuid
 *                     branchName:
 *                       type: string
 *                     bankAddress:
 *                       type: string
 */
router.put('/:oid', validateRequest(updateBankBranchRequestDto), roleGuard('Admin'), bankBranchController.update);

/**
 * @swagger
 * /bankbranch/delete/{oid}:
 *   delete:
 *     tags: [BankBranch]
 *     summary: Delete a bank branch by oid
 *     description: Deletes a bank branch identified by the UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         description: UUID of the bank branch to delete
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     responses:
 *       200:
 *         description: Bank branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: "success"
 */
router.delete('/delete/:oid', validateRequest(deleteBankBranchDto), roleGuard('Admin'), bankBranchController.delete);

/**
 * @swagger
 * /bankbranch:
 *   get:
 *     tags: [BankBranch]
 *     summary: Retrieve a list of bank branches with filters and pagination
 *     description: Retrieves paginated bank branch data based on optional filters.
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
 *       description: Filter criteria for bank branches
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankOid:
 *                 type: string
 *                 format: uuid
 *                 example: ""
 *               branchName:
 *                 type: string
 *                 example: ""
 *               bankAddress:
 *                 type: string
 *                 example: ""
 *               fieldName:
 *                 type: string
 *                 example: "branchName"
 *               sortOrder:
 *                 type: integer
 *                 enum: [-1, 0, 1]
 *                 example: 1
 *     responses:
 *       200:
 *         description: List of bank branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
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
 *                       bankOid:
 *                         type: string
 *                         format: uuid
 *                       branchName:
 *                         type: string
 *                       bankAddress:
 *                         type: string
 */
router.get('/', validateRequest(filterBankBranchDto), roleGuard('Admin'), bankBranchController.findAll);

/**
 * @swagger
 * /bankbranch/{oid}:
 *   get:
 *     tags: [BankBranch]
 *     summary: Retrieve a bank branch by oid
 *     description: Fetch details of a bank branch by UUID.
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "01920370-1523-78ec-8a88-9b01fe874882"
 *     responses:
 *       200:
 *         description: Bank branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
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
 *                     bankOid:
 *                       type: string
 *                       format: uuid
 *                     branchName:
 *                       type: string
 *                     bankAddress:
 *                       type: string
 */
router.get('/:oid', validateRequest(getBankBranchDto), roleGuard('Admin'), bankBranchController.findById);

module.exports = router;
