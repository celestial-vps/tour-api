const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const roomController = require('../controllers/room.controller');
const { validateRequest } = require('../misc/validation');
const {
  createRoomDto,
  updateRoomDto,
  deleteRoomDto,
  filterRoomDto,
  getRoomDto
} = require('../dtos/payload-room-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Rooms
 *     description: Room management operations
 */

/**
 * @swagger
 * /rooms/create:
 *   post:
 *     tags: [Rooms]
 *     summary: Create a new room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoom'
 *     responses:
 *       200:
 *         description: Room created successfully
 */
router.post('/create', validateRequest(createRoomDto), roleGuard('Admin'), roomController.create);

/**
 * @swagger
 * /rooms/{oid}:
 *   put:
 *     tags: [Rooms]
 *     summary: Update an existing room
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
 *             $ref: '#/components/schemas/UpdateRoom'
 *     responses:
 *       200:
 *         description: Room updated successfully
 */
router.put('/:oid', validateRequest(updateRoomDto), roleGuard('Admin'), roomController.update);

/**
 * @swagger
 * /rooms/delete/{oid}:
 *   delete:
 *     tags: [Rooms]
 *     summary: Delete a room
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteRoomDto), roleGuard('Admin'), roomController.remove);

/**
 * @swagger
 * /rooms:
 *   get:
 *     tags: [Rooms]
 *     summary: Get all rooms
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/', validateRequest(filterRoomDto), roleGuard('Admin'), roomController.findAll);

/**
 * @swagger
 * /rooms/q:
 *   post:
 *     tags: [Rooms]
 *     summary: Paginate rooms
 *     parameters:
 *       - name: pageIndex
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           default: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FilterRoom'
 *     responses:
 *       200:
 *         description: Paginated list of rooms
 */
router.post('/q', validateRequest(filterRoomDto), roleGuard('Admin'), roomController.find);

/**
 * @swagger
 * /rooms/{oid}:
 *   get:
 *     tags: [Rooms]
 *     summary: Get a single room by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single room entry
 */
router.get('/:oid', validateRequest(getRoomDto), roleGuard('Admin'), roomController.findById);

module.exports = router;
