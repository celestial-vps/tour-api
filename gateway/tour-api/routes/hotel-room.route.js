const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const hotelRoomController = require('../controllers/hotel-room.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterHotelRoomDto,
  createHotelRoomDto,
  updateHotelRoomDto,
  deleteHotelRoomDto,
  getHotelRoomDto
} = require('../dtos/payload-hotel-room-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Hotel Room
 *     description: HotelRoom management operations
 */

/**
 * @swagger
 * /hotel-room/create:
 *   post:
 *     tags: [Hotel Room]
 *     summary: Create a new hotelroom entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              hotelOid:
 *                type: string
 *                example: "-"
 *              roomType:
 *                type: string
 *                example: "-"
 *              capacity:
 *                type: INTEGER
 *                example: "-"
 *              pricePerNight:
 *                type: string
 *                example: "-"
 *              amenities:
 *                type: interger
 *                example: "-"
 *              status:
 *                type: interger
 *                example: "-"

 *     responses:
 *       200:
 *         description: HotelRoom created successfully
 */
router.post('/create', validateRequest(createHotelRoomDto), roleGuard('Admin'), hotelRoomController.create);

/**
 * @swagger
 * /hotel-room/{oid}:
 *   put:
 *     tags: [Hotel Room]
 *     summary: Update an existing hotelroom entry
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
 *         description: HotelRoom updated successfully
 */
router.put('/:oid', validateRequest(updateHotelRoomDto), roleGuard('Admin'), hotelRoomController.update);

/**
 * @swagger
 * /hotel-room/delete/{oid}:
 *   delete:
 *     tags: [Hotel Room]
 *     summary: Delete a hotelroom entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: HotelRoom deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteHotelRoomDto), roleGuard('Admin'), hotelRoomController.remove);

/**
 * @swagger
 * /hotel-room:
 *   get:
 *     tags: [Hotel Room]
 *     summary: Get all hotelrooms with optional filters
 *     parameters:
 *       - in: query
 *         name: hotelroomCode
 *         schema:
 *           type: string
 *         description: Filter by hotelroomCode
 *       - in: query
 *         name: hotelroomName
 *         schema:
 *           type: string
 *         description: Filter by hotelroomName
 *     responses:
 *       200:
 *         description: List of hotelrooms
 */
router.get('/', validateRequest(filterHotelRoomDto), roleGuard('Admin'), hotelRoomController.findAll);

/**
 * @swagger
 * /hotel-room/q:
 *   post:
 *     tags: [Hotel Room]
 *     summary: Paginate hotelrooms with filters
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
  *               hotelroomCode:
 *                 type: string
 *                 example: "-"
 *               hotelroomName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of hotelrooms
 */
router.post('/q', validateRequest(filterHotelRoomDto), roleGuard('Admin'), hotelRoomController.find);
/**
 * @swagger
 * /hotel-room/{oid}:
 *   get:
 *     tags: [Hotel Room]
 *     summary: Get a single hotelroom by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A hotelroom entry
 */

router.get('/:oid', validateRequest(getHotelRoomDto), roleGuard('Admin'), hotelRoomController.findById);

module.exports = router;
