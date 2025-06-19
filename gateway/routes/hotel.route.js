const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const hotelController = require('../controllers/hotel.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterHotelDto,
  createHotelDto,
  updateHotelDto,
  deleteHotelDto,
  getHotelDto
} = require('../dtos/payload-hotel-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Hotel
 *     description: Hotel management operations
 */

/**
 * @swagger
 * /hotel/create:
 *   post:
 *     tags: [Hotel]
 *     summary: Create a new hotel entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              hotelName:
 *                type: string
 *                example: "-"
 *              address:
 *                type: string
 *                example: "-"
 *              phone:
 *                type: INTEGER
 *                example: "-"
 *              star_rating:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Hotel created successfully
 */
router.post('/create', validateRequest(createHotelDto), roleGuard('Admin'), hotelController.create);

/**
 * @swagger
 * /hotel/{oid}:
 *   put:
 *     tags: [Hotel]
 *     summary: Update an existing hotel entry
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
 *         description: Hotel updated successfully
 */
router.put('/:oid', validateRequest(updateHotelDto), roleGuard('Admin'), hotelController.update);

/**
 * @swagger
 * /hotel/delete/{oid}:
 *   delete:
 *     tags: [Hotel]
 *     summary: Delete a hotel entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteHotelDto), roleGuard('Admin'), hotelController.remove);

/**
 * @swagger
 * /hotel:
 *   get:
 *     tags: [Hotel]
 *     summary: Get all hotels with optional filters
 *     parameters:
 *       - in: query
 *         name: hotelCode
 *         schema:
 *           type: string
 *         description: Filter by hotelCode
 *       - in: query
 *         name: hotelName
 *         schema:
 *           type: string
 *         description: Filter by hotelName
 *     responses:
 *       200:
 *         description: List of hotels
 */
router.get('/', validateRequest(filterHotelDto), roleGuard('Admin'), hotelController.findAll);

/**
 * @swagger
 * /hotel/q:
 *   post:
 *     tags: [Hotel]
 *     summary: Paginate hotels with filters
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
  *               hotelCode:
 *                 type: string
 *                 example: "-"
 *               hotelName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of hotels
 */
router.post('/q', validateRequest(filterHotelDto), roleGuard('Admin'), hotelController.find);
/**
 * @swagger
 * /hotel/{oid}:
 *   get:
 *     tags: [Hotel]
 *     summary: Get a single hotel by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A hotel entry
 */

router.get('/:oid', validateRequest(getHotelDto), roleGuard('Admin'), hotelController.findById);

module.exports = router;
