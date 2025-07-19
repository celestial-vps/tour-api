const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const travelBookingController = require('../controllers/travel-booking.controller.js');
const { validateRequest } = require('../misc/validation');
const {
  filterTravelBookingDto,
  createTravelBookingDto,createTravelBookingNoAuthDto,
  updateTravelBookingDto,
  deleteTravelBookingDto,
  getTravelBookingDto
} = require('../dtos/payload-travel-booking-dto.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Travel Booking
 *     description: Travel Booking management operations
 */

/**
 * @swagger
 * /travel-booking/create:
 *   post:
 *     tags: [Travel Booking]
 *     summary: Create a new Travel Booking entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              code:
 *                type: string
 *                example: "-"
 *              discountType:
 *                type: string
 *                example: "-"
 *              discountValue:
 *                type: DECIMAL
 *                example: "-"
 *              usageLimit:
 *                type: INTEGER
 *                example: "-"
 *              usedCount:
 *                type: INTEGER
 *                example: "-"
 *              validFrom:
 *                type: date
 *                example: "-"
 *              validUntil:
 *                type: date
 *                example: "-"
 *              isActive:
 *                type: BOOLEAN
 *                example: "-"
 *              description:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Travel Booking created successfully
 */
router.post('/create', validateRequest(createTravelBookingDto), roleGuard('Admin'), travelBookingController.create);



/**
 * @swagger
 * /travel-booking/create/no-auth:
 *   post:
 *     tags: [Travel Booking]
 *     summary: Create a new Travel Booking entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              code:
 *                type: string
 *                example: "-"
 *              discountType:
 *                type: string
 *                example: "-"
 *              discountValue:
 *                type: DECIMAL
 *                example: "-"
 *              usageLimit:
 *                type: INTEGER
 *                example: "-"
 *              usedCount:
 *                type: INTEGER
 *                example: "-"
 *              validFrom:
 *                type: date
 *                example: "-"
 *              validUntil:
 *                type: date
 *                example: "-"
 *              isActive:
 *                type: BOOLEAN
 *                example: "-"
 *              description:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Travel Booking created successfully
 */
router.post('/create/no-auth', validateRequest(createTravelBookingNoAuthDto), travelBookingController.createNoAuth);


/**
 * @swagger
 * /travel-booking/{oid}:
 *   put:
 *     tags: [Travel Booking]
 *     summary: Update an existing Travel Booking entry
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
 *         description: Travel Booking updated successfully
 */
router.put('/:oid', validateRequest(updateTravelBookingDto), roleGuard('Admin'), travelBookingController.update);

/**
 * @swagger
 * /travel-booking/delete/{oid}:
 *   delete:
 *     tags: [Travel Booking]
 *     summary: Delete a Travel Booking entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Travel Booking deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteTravelBookingDto), roleGuard('Admin'), travelBookingController.remove);

/**
 * @swagger
 * /travel-booking:
 *   get:
 *     tags: [Travel Booking]
 *     summary: Get all Travel Bookings with optional filters
 *     parameters:
 *       - in: query
 *         name: travelBookingCode
 *         schema:
 *           type: string
 *         description: Filter by travelBookingCode
 *       - in: query
 *         name: travelBookingName
 *         schema:
 *           type: string
 *         description: Filter by travelBookingName
 *     responses:
 *       200:
 *         description: List of Travel Bookings
 */
router.get('/', validateRequest(filterTravelBookingDto), roleGuard('Admin'), travelBookingController.findAll);

/**
 * @swagger
 * /travel-booking/q:
 *   post:
 *     tags: [Travel Booking]
 *     summary: Paginate Travel Bookings with filters
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
  *               travelBookingCode:
 *                 type: string
 *                 example: "-"
 *               travelBookingName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Travel Bookings
 */
router.post('/q', validateRequest(filterTravelBookingDto), roleGuard('Admin'), travelBookingController.find);

 

/**
 * @swagger
 * /travel-booking/{oid}:
 *   get:
 *     tags: [Travel Booking]
 *     summary: Get a single Travel Booking by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Travel Booking entry
 */

router.get('/:oid', validateRequest(getTravelBookingDto), roleGuard('Admin'), travelBookingController.findById);

module.exports = router;
