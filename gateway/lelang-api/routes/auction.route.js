const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const auctionController = require('../controllers/auction.controller');
const { validateRequest } = require('../misc/validation');
const {
    filterAuctionDto,
    createAuctionDto,
    updateAuctionDto,
    deleteAuctionDto,
    getAuctionDto
} = require('../dtos/payload-auction-dto');

const j2s = require('joi-to-swagger');

// Convert DTO ke Swagger schema
const { swagger: createAuctionSchema } = j2s(createAuctionDto);
const { swagger: updateAuctionSchema } = j2s(updateAuctionDto);
const { swagger: filterAuctionSchema } = j2s(filterAuctionDto);

const router = express.Router();

/**
 * @swagger
 * /auction/create:
 *   post:
 *     tags: [Auction]
 *     summary: Create a new auction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(createAuctionSchema)}
 *     responses:
 *       200:
 *         description: Auction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     value: { type: string, example: "650f8a1234567890abcdef" }
 *                     name: { type: string, example: "Auction created successfully" }
 *       400:
 *         description: Bad Request - Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.post('/create', validateRequest(createAuctionDto), roleGuard('Admin'), auctionController.create);

/**
 * @swagger
 * /auction/{oid}:
 *   put:
 *     tags: [Auction]
 *     summary: Update an auction
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(updateAuctionSchema)}
 *     responses:
 *       200:
 *         description: Auction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     value: { type: string, example: "650f8a1234567890abcdef" }
 *                     name: { type: string, example: "Auction updated successfully" }
 *       400:
 *         description: Bad Request - Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.put('/:oid', validateRequest(updateAuctionDto), roleGuard('Admin'), auctionController.update);

/**
 * @swagger
 * /auction/delete/{oid}:
 *   delete:
 *     tags: [Auction]
 *     summary: Delete an auction
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Auction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     value: { type: string, example: "650f8a1234567890abcdef" }
 *                     name: { type: string, example: "Auction deleted successfully" }
 *       400:
 *         description: Bad Request - Validation failed or invalid OID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.delete('/delete/:oid', validateRequest(deleteAuctionDto), roleGuard('Admin'), auctionController.remove);

/**
 * @swagger
 * /auction:
 *   get:
 *     tags: [Auction]
 *     summary: Get all auctions
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid: { type: string, example: "650f8a1234567890abcdef" }
 *                       itemOid: { type: string, example: "678e4567-e89b-12d3-a456-426614174abc" }
 *                       startTime: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                       endTime: { type: string, format: date-time, example: "2025-12-05T12:00:00Z" }
 *                       status: { type: string, example: "pending" }
 *                       createdBy: { type: string, example: "admin" }
 *                       updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *       400:
 *         description: Bad Request - Invalid query or filter parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.get('/', validateRequest(filterAuctionDto), roleGuard('Admin'), auctionController.findAll);

/**
 * @swagger
 * /auction/{oid}:
 *   get:
 *     tags: [Auction]
 *     summary: Get a single auction by ID
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Single auction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 1 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     oid: { type: string, example: "650f8a1234567890abcdef" }
 *                     itemOid: { type: string, example: "678e4567-e89b-12d3-a456-426614174abc" }
 *                     startTime: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                     endTime: { type: string, format: date-time, example: "2025-12-05T12:00:00Z" }
 *                     status: { type: string, example: "pending" }
 *                     createdBy: { type: string, example: "admin" }
 *                     updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *       400:
 *         description: Bad Request - Invalid OID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.get('/:oid', validateRequest(getAuctionDto), roleGuard('Admin'), auctionController.findById);

/**
 * @swagger
 * /auction/q:
 *   post:
 *     tags: [Auction]
 *     summary: Paginate auctions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: ${JSON.stringify(filterAuctionSchema)}
 *     responses:
 *       200:
 *         description: Paginated list of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "200" }
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: "Success" }
 *                 total: { type: integer, example: 3 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       oid: { type: string, example: "650f8a1234567890abcdef" }
 *                       itemOid: { type: string, example: "678e4567-e89b-12d3-a456-426614174abc" }
 *                       startTime: { type: string, format: date-time, example: "2025-12-05T10:00:00Z" }
 *                       endTime: { type: string, format: date-time, example: "2025-12-05T12:00:00Z" }
 *                       status: { type: string, example: "pending" }
 *                       createdBy: { type: string, example: "admin" }
 *                       updatedAt: { type: string, format: date-time, example: "2025-12-05T10:01:00Z" }
 *       400:
 *         description: Bad Request - Invalid filter or pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "400" }
 *                 status: { type: integer, example: 400 }
 *                 message: { type: string, example: "Invalid request data" }
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "500" }
 *                 status: { type: integer, example: 500 }
 *                 message: { type: string, example: "Something went wrong" }
 */
router.post('/q', validateRequest(filterAuctionDto), roleGuard('Admin'), auctionController.find);

module.exports = router;
