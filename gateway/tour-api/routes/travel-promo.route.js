const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const travelPromoController = require('../controllers/travel-promo.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterTravelPromoDto,
  createTravelPromoDto,
  updateTravelPromoDto,
  deleteTravelPromoDto,
  getTravelPromoDto
} = require('../dtos/payload-travel-promo-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Travel Promo
 *     description: Travel Promo management operations
 */

/**
 * @swagger
 * /travel-promo/create:
 *   post:
 *     tags: [Travel Promo]
 *     summary: Create a new Travel Promo entry
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
 *         description: Travel Promo created successfully
 */
router.post('/create', validateRequest(createTravelPromoDto), roleGuard('Admin'), travelPromoController.create);

/**
 * @swagger
 * /travel-promo/{oid}:
 *   put:
 *     tags: [Travel Promo]
 *     summary: Update an existing Travel Promo entry
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
 *         description: Travel Promo updated successfully
 */
router.put('/:oid', validateRequest(updateTravelPromoDto), roleGuard('Admin'), travelPromoController.update);

/**
 * @swagger
 * /travel-promo/delete/{oid}:
 *   delete:
 *     tags: [Travel Promo]
 *     summary: Delete a Travel Promo entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Travel Promo deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteTravelPromoDto), roleGuard('Admin'), travelPromoController.remove);

/**
 * @swagger
 * /travel-promo:
 *   get:
 *     tags: [Travel Promo]
 *     summary: Get all Travel Promos with optional filters
 *     parameters:
 *       - in: query
 *         name: travelPromoCode
 *         schema:
 *           type: string
 *         description: Filter by travelPromoCode
 *       - in: query
 *         name: travelPromoName
 *         schema:
 *           type: string
 *         description: Filter by travelPromoName
 *     responses:
 *       200:
 *         description: List of Travel Promos
 */
router.get('/', validateRequest(filterTravelPromoDto), roleGuard('Admin'), travelPromoController.findAll);

/**
 * @swagger
 * /travel-promo/q:
 *   post:
 *     tags: [Travel Promo]
 *     summary: Paginate Travel Promos with filters
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
  *               travelPromoCode:
 *                 type: string
 *                 example: "-"
 *               travelPromoName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Travel Promos
 */
router.post('/q', validateRequest(filterTravelPromoDto), roleGuard('Admin'), travelPromoController.find);

/**
 * @swagger
 * /travel-promo/{oid}:
 *   get:
 *     tags: [Travel Promo]
 *     summary: Get a single Travel Promo by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Travel Promo entry
 */

router.get('/:oid', validateRequest(getTravelPromoDto), roleGuard('Admin'), travelPromoController.findById);

module.exports = router;
