const express = require('express');
const bidderController = require('../controllers/bidder.controller');
const {roleGuard} = require('../middleware/role-guard');
const {
    createBidderDto,
    updateBidderDto,
    params,
    query,
    pageBidderDto
} = require('../dtos/payload-bidder-dto'); // pastikan path sesuai
const { validateRequest } = require('../misc/validation'); // middleware untuk Joi

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Bidder
 *     description: Bidder management
 */

/**
 * @swagger
 * /bidder/create:
 *   post:
 *     tags: [Bidder]
 *     summary: Create a new bidder
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBidderDto'
 *     responses:
 *       200:
 *         description: Bidder created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BidderResponse'
 */
router.post('/create', roleGuard('Admin'), validateRequest(createBidderDto), bidderController.create);

/**
 * @swagger
 * /bidder/{oid}:
 *   put:
 *     tags: [Bidder]
 *     summary: Update a bidder
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
 *             $ref: '#/components/schemas/UpdateBidderDto'
 *     responses:
 *       200:
 *         description: Bidder updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BidderResponse'
 */
router.put('/:oid', roleGuard('Admin'), validator.params(params), validateRequest(updateBidderDto), bidderController.update);

/**
 * @swagger
 * /bidder/{oid}:
 *   get:
 *     tags: [Bidder]
 *     summary: Get bidder by ID
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
 *         description: Bidder retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BidderResponse'
 */
router.get('/:oid', roleGuard('Admin'), validator.params(params), bidderController.findById);

/**
 * @swagger
 * /bidder/delete/{oid}:
 *   delete:
 *     tags: [Bidder]
 *     summary: Delete a bidder
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
 *         description: Bidder deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BidderResponse'
 */
router.delete('/delete/:oid', roleGuard('Admin'), validator.params(params), bidderController.remove);

/**
 * @swagger
 * /bidder/q:
 *   post:
 *     tags: [Bidder]
 *     summary: Query bidders with pagination
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PageBidderDto'
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
 *     responses:
 *       200:
 *         description: Paginated bidder list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultCode:
 *                   type: string
 *                 httpStatus:
 *                   type: string
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BidderResponse'
 */
router.post('/q', roleGuard('Admin'), validateRequest(pageBidderDto), validator.query(query), bidderController.find);

module.exports = router;
