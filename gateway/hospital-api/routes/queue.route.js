const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const queueController = require('../controllers/queue.controller');
const { validateRequest } = require('../misc/validation');
const {
  createQueueDto,
  updateQueueDto,
  deleteQueueDto,
  filterQueueDto,
  getQueueDto
} = require('../dtos/payload-queue-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Queues
 *     description: Queue management operations
 */

/**
 * @swagger
 * /queues/create:
 *   post:
 *     tags: [Queues]
 *     summary: Create a new queue entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQueue'
 *     responses:
 *       200:
 *         description: Queue created successfully
 */
router.post('/create', validateRequest(createQueueDto), roleGuard('Admin'), queueController.create);

/**
 * @swagger
 * /queues/{oid}:
 *   put:
 *     tags: [Queues]
 *     summary: Update an existing queue entry
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
 *             $ref: '#/components/schemas/UpdateQueue'
 *     responses:
 *       200:
 *         description: Queue updated successfully
 */
router.put('/:oid', validateRequest(updateQueueDto), roleGuard('Admin'), queueController.update);

/**
 * @swagger
 * /queues/delete/{oid}:
 *   delete:
 *     tags: [Queues]
 *     summary: Delete a queue entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Queue deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteQueueDto), roleGuard('Admin'), queueController.remove);

/**
 * @swagger
 * /queues:
 *   get:
 *     tags: [Queues]
 *     summary: Get all queues
 *     responses:
 *       200:
 *         description: List of queues
 */
router.get('/', validateRequest(filterQueueDto), roleGuard('Admin'), queueController.findAll);

/**
 * @swagger
 * /queues/q:
 *   post:
 *     tags: [Queues]
 *     summary: Paginate queues
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
 *             $ref: '#/components/schemas/FilterQueue'
 *     responses:
 *       200:
 *         description: Paginated list of queues
 */
router.post('/q', validateRequest(filterQueueDto), roleGuard('Admin'), queueController.find);

/**
 * @swagger
 * /queues/{oid}:
 *   get:
 *     tags: [Queues]
 *     summary: Get a single queue by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single queue entry
 */
router.get('/:oid', validateRequest(getQueueDto), roleGuard('Admin'), queueController.findById);

module.exports = router;
