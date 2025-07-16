const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const subjectCategoryController = require('../controllers/subject-category.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterSubjectCategoryDto,
  createSubjectCategoryDto,
  updateSubjectCategoryDto,
  deleteSubjectCategoryDto,
  getSubjectCategoryDto
} = require('../dtos/payload-subject-category-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Subject Category
 *     description: Subject Category management operations
 */

/**
 * @swagger
 * /subject-category/create:
 *   post:
 *     tags: [Subject Category]
 *     summary: Create a new Subject Category entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              categoryName:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Subject Category created successfully
 */
router.post('/create', validateRequest(createSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.create);

/**
 * @swagger
 * /subject-category/{oid}:
 *   put:
 *     tags: [Subject Category]
 *     summary: Update an existing Subject Category entry
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
 *         description: Subject Category updated successfully
 */
router.put('/:oid', validateRequest(updateSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.update);

/**
 * @swagger
 * /subject-category/delete/{oid}:
 *   delete:
 *     tags: [Subject Category]
 *     summary: Delete a Subject Category entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Subject Category deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.remove);

/**
 * @swagger
 * /subject-category:
 *   get:
 *     tags: [Subject Category]
 *     summary: Get all Subject Categories with optional filters
 *     parameters:
 *       - in: query
 *         name: subjectCategoryCode
 *         schema:
 *           type: string
 *         description: Filter by subjectCategoryCode
 *       - in: query
 *         name: subjectCategoryName
 *         schema:
 *           type: string
 *         description: Filter by subjectCategoryName
 *     responses:
 *       200:
 *         description: List of Subject Categories
 */
router.get('/', validateRequest(filterSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.findAll);

/**
 * @swagger
 * /subject-category/q:
 *   post:
 *     tags: [Subject Category]
 *     summary: Paginate Subject Categories with filters
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
  *               subjectCategoryCode:
 *                 type: string
 *                 example: "-"
 *               subjectCategoryName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Subject Categories
 */
router.post('/q', validateRequest(filterSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.find);

/**
 * @swagger
 * /subject-category/{oid}:
 *   get:
 *     tags: [Subject Category]
 *     summary: Get a single Subject Category by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Subject Category entry
 */

router.get('/:oid', validateRequest(getSubjectCategoryDto), roleGuard('Admin'), subjectCategoryController.findById);

module.exports = router;
