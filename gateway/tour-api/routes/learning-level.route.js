const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const learningLevelController = require('../controllers/learning-level.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterLearningLevelDto,
  createLearningLevelDto,
  updateLearningLevelDto,
  deleteLearningLevelDto,
  getLearningLevelDto
} = require('../dtos/payload-learning-level-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Learning Level
 *     description: Learning Level management operations
 */

/**
 * @swagger
 * /learning-level/create:
 *   post:
 *     tags: [Learning Level]
 *     summary: Create a new Learning Level entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              levelName:
 *                type: string
 *                example: "-"
 *              type:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Learning Level created successfully
 */
router.post('/create', validateRequest(createLearningLevelDto), roleGuard('Admin'), learningLevelController.create);

/**
 * @swagger
 * /learning-level/{oid}:
 *   put:
 *     tags: [Learning Level]
 *     summary: Update an existing Learning Level entry
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
 *         description: Learning Level updated successfully
 */
router.put('/:oid', validateRequest(updateLearningLevelDto), roleGuard('Admin'), learningLevelController.update);

/**
 * @swagger
 * /learning-level/delete/{oid}:
 *   delete:
 *     tags: [Learning Level]
 *     summary: Delete a Learning Level entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Learning Level deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteLearningLevelDto), roleGuard('Admin'), learningLevelController.remove);

/**
 * @swagger
 * /learning-level:
 *   get:
 *     tags: [Learning Level]
 *     summary: Get all Learning Levels with optional filters
 *     parameters:
 *       - in: query
 *         name: learningLevelCode
 *         schema:
 *           type: string
 *         description: Filter by learningLevelCode
 *       - in: query
 *         name: learningLevelName
 *         schema:
 *           type: string
 *         description: Filter by learningLevelName
 *     responses:
 *       200:
 *         description: List of Learning Levels
 */
router.get('/', validateRequest(filterLearningLevelDto), roleGuard('Admin'), learningLevelController.findAll);

/**
 * @swagger
 * /learning-level/q:
 *   post:
 *     tags: [Learning Level]
 *     summary: Paginate Learning Levels with filters
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
  *               learningLevelCode:
 *                 type: string
 *                 example: "-"
 *               learningLevelName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Learning Levels
 */
router.post('/q', validateRequest(filterLearningLevelDto), roleGuard('Admin'), learningLevelController.find);

/**
 * @swagger
 * /learning-level/{oid}:
 *   get:
 *     tags: [Learning Level]
 *     summary: Get a single Learning Level by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Learning Level entry
 */

router.get('/:oid', validateRequest(getLearningLevelDto), roleGuard('Admin'), learningLevelController.findById);

module.exports = router;
