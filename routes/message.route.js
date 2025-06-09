const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const messageController = require('../controllers/message.controller');
const { validateRequest } = require('../misc/validation');
const {
    createMessageDto, updateMessageDto, deleteMessageDto, getMessageDto, filterMessageDto
} = require('../dtos/payload-message-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Message
 *     description: Message management operations
 */

/**
 * @swagger
 * /message/create:
 *   post:
 *     tags: [Message]
 *     summary: Create a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message created successfully
 */
router.post('/create', validateRequest(createMessageDto), roleGuard('Admin'), messageController.create);

/**
 * @swagger
 * /message/{oid}:
 *   put:
 *     tags: [Message]
 *     summary: Update a message
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 */
router.put('/:oid', validateRequest(updateMessageDto), roleGuard('Admin'), messageController.update);

/**
 * @swagger
 * /message/delete/{oid}:
 *   delete:
 *     tags: [Message]
 *     summary: Delete a message
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteMessageDto), roleGuard('Admin'), messageController.remove);

/**
 * @swagger
 * /message:
 *   get:
 *     tags: [Message]
 *     summary: Get all messages
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/', validateRequest(filterMessageDto), roleGuard('Admin'), messageController.findAll);

/**
 * @swagger
 * /message/q:
 *   post:
 *     tags: [Message]
 *     summary: Query messages with pagination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paginated list of messages
 */
router.post('/q', validateRequest(filterMessageDto), roleGuard('Admin'), messageController.find);

/**
 * @swagger
 * /message/{oid}:
 *   get:
 *     tags: [Message]
 *     summary: Get message by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message details
 */
router.get('/:oid', validateRequest(getMessageDto), roleGuard('Admin'), messageController.findById);

module.exports = router;
