const express = require('express');
const { roleGuard } = require('../middleware/role-guard');
const travelScheduleController = require('../controllers/travel-schedule.controller');
const { validateRequest } = require('../misc/validation');
const {
  filterTravelScheduleDto,
  createTravelScheduleDto,
  updateTravelScheduleDto,
  deleteTravelScheduleDto,
  getTravelScheduleDto,
  filterTravelScheduleNoAuthDto
} = require('../dtos/payload-travel-schedule-dto');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Travel Schedule
 *     description: Travel Schedule management operations
 */

/**
 * @swagger
 * /travel-schedule/create:
 *   post:
 *     tags: [Travel Schedule]
 *     summary: Create a new Travel Schedule entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              routeOid:
 *                type: string
 *                example: "-"
 *              vehicleOid:
 *                type: string
 *                example: "-"
 *              driverOid:
 *                type: string
 *                example: "-"
 *              depatureTime:
 *                type: date
 *                example: "-"
 *              arrivalTime:
 *                type: date
 *                example: "-"
 *              status:
 *                type: string
 *                example: "-"

 *     responses:
 *       200:
 *         description: Travel Schedule created successfully
 */
router.post('/create', validateRequest(createTravelScheduleDto), roleGuard('Admin'), travelScheduleController.create);

/**
 * @swagger
 * /travel-schedule/{oid}:
 *   put:
 *     tags: [Travel Schedule]
 *     summary: Update an existing Travel Schedule entry
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
 *         description: Travel Schedule updated successfully
 */
router.put('/:oid', validateRequest(updateTravelScheduleDto), roleGuard('Admin'), travelScheduleController.update);

/**
 * @swagger
 * /travel-schedule/delete/{oid}:
 *   delete:
 *     tags: [Travel Schedule]
 *     summary: Delete a Travel Schedule entry
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Travel Schedule deleted successfully
 */
router.delete('/delete/:oid', validateRequest(deleteTravelScheduleDto), roleGuard('Admin'), travelScheduleController.remove);

/**
 * @swagger
 * /travel-schedule:
 *   get:
 *     tags: [Travel Schedule]
 *     summary: Get all Travel Schedules with optional filters
 *     parameters:
 *       - in: query
 *         name: travelScheduleCode
 *         schema:
 *           type: string
 *         description: Filter by travelScheduleCode
 *       - in: query
 *         name: travelScheduleName
 *         schema:
 *           type: string
 *         description: Filter by travelScheduleName
 *     responses:
 *       200:
 *         description: List of Travel Schedules
 */
router.get('/', validateRequest(filterTravelScheduleDto), roleGuard('Admin'), travelScheduleController.findAll);

/**
 * @swagger
 * /travel-schedule/q:
 *   post:
 *     tags: [Travel Schedule]
 *     summary: Paginate Travel Schedules with filters
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
  *               travelScheduleCode:
 *                 type: string
 *                 example: "-"
 *               travelScheduleName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Travel Schedules
 */
router.post('/q', validateRequest(filterTravelScheduleDto), roleGuard('Admin'), travelScheduleController.find);

/**
 * @swagger
 * /travel-schedule/q/no-auth:
 *   post:
 *     tags: [Travel Schedule]
 *     summary: Paginate Travel Schedules with filters
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
  *               travelScheduleCode:
 *                 type: string
 *                 example: "-"
 *               travelScheduleName:
 *                 type: string
 *                 example: "-"
 *     responses:
 *       200:
 *         description: Paginated list of Travel Schedules
 */
router.post('/q/no-auth', validateRequest(filterTravelScheduleNoAuthDto), travelScheduleController.findCriteria);


/**
 * @swagger
 * /travel-schedule/{oid}:
 *   get:
 *     tags: [Travel Schedule]
 *     summary: Get a single Travel Schedule by ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A Travel Schedule entry
 */

router.get('/:oid', validateRequest(getTravelScheduleDto), roleGuard('Admin'), travelScheduleController.findById);

module.exports = router;
