const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const travelRouteController = require('../controllers/travel-route.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterTravelRouteDto,
  createTravelRouteDto,
  updateTravelRouteDto,
  deleteTravelRouteDto,
  getTravelRouteDto
} = require('../dtos/payload-travel-route-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Travel Route
 *     description: Travel Route management operations
 */

/**
 * @swagger
 * /travel-route/create:
 *   post:
 *     tags: [Travel Route]
 *     summary: Create a new Travel Route entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              originOid:
 *                type: string
 *                example: "-"
 *              destinationOid:
 *                type: string
 *                example: "-"
 *              estimatedTime:
 *                type: TIME
 *                example: "-"

 *     responses:
 *       200:
 *         description: Travel Route created successfully
 */
router.post('/create', validateRequest(createTravelRouteDto), roleGuard('Admin'), travelRouteController.create);

/**
 * @swagger
 * /travel-route/{oid}:
 *   put:
 *     tags: [Travel Route]
 *     summary: Update an existing Travel Route entry
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
 *         description: Travel Route updated successfully
 */
router.put('/:oid', validateRequest(updateTravelRouteDto), roleGuard('Admin'), travelRouteController.update);

/**
 * @swagger
 * /travel-route/delete/{oid}:
 *   delete:
 *     tags: [Travel Route]
 *     summary: Delete a Travel Route entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Travel Route deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteTravelRouteDto), roleGuard('Admin'), travelRouteController.remove);

/**
 * @swagger
 * /travel-route:
 *   get:
 *     tags: [Travel Route]
 *     summary: Get all Travel Routes with optional filters
 *     parameters:
 *       - in: query
 *         name: travelRouteCode
 *         schema:
 *           type: string
 *         description: Filter by travelRouteCode
 *       - in: query
 *         name: travelRouteName
 *         schema:
 *           type: string
 *         description: Filter by travelRouteName
 *     responses:
 *       200:
 *         description: List of Travel Routes
 */
router.get('/', validateRequest(filterTravelRouteDto), roleGuard('Admin'), travelRouteController.findAll);

/**
 * @swagger
 * /travel-route/q:
 *   post:
 *     tags: [Travel Route]
 *     summary: Paginate Travel Routes with filters
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
  *               travelRouteCode:
 *                 type: string
 *                 example: "-"
 *               travelRouteName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Travel Routes
 */
router.post('/q', validateRequest(filterTravelRouteDto), roleGuard('Admin'), travelRouteController.find);

/**
 * @swagger
 * /travel-route/{oid}:
 *   get:
 *     tags: [Travel Route]
 *     summary: Get a single Travel Route by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Travel Route entry
 */

router.get('/:oid', validateRequest(getTravelRouteDto), roleGuard('Admin'), travelRouteController.findById);

module.exports = router;
