const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const queueController = require("../controllers/queue.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createQueueDto,
  updateQueueDto,
  deleteQueueDto,
  getQueueDto, filterQueueDto, queueResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-queue-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateQueuePayloadSchema } = j2s(createDto);
const { swagger: UpdateQueuePayloadSchema } = j2s(updateDto);
const { swagger: DeleteQueuePayloadSchema } = j2s(params);
const { swagger: FilterQueuePayloadSchema } = j2s(filterDto);
const { swagger: QueueSuccessSchema } = j2s(successResponse(queueResponseDto));
const { swagger: QueueListSuccessSchema } = j2s(
  successResponse(Joi.array().items(queueResponseDto))
);


// Response Schema (success + error)

const { swagger: QueueSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateQueuePayloadDto = CreateQueuePayloadSchema;
global.swaggerComponents.FilterQueuePayloadDto = FilterQueuePayloadSchema;
global.swaggerComponents.UpdateQueuePayloadDto = UpdateQueuePayloadSchema;
global.swaggerComponents.DeleteQueuePayloadDto = DeleteQueuePayloadSchema;
global.swaggerComponents.QueueListSuccessResponse = QueueListSuccessSchema;
global.swaggerComponents.QueueSuccessResponse = QueueSuccessSchema;
global.swaggerComponents.QueueSuccessCRUDResponse = QueueSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /queue/create:
 *   post:
 *     tags:
 *       - Queue
 *     summary: Create Queue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateQueuePayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/create",
  validateRequest(createQueueDto),
  roleGuard("Admin"),
  queueController.create
);


/**
 * @openapi
 * /queue/{oid}:
 *   put:
 *     tags: [Queue]
 *     summary: Update Queue
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
 *             $ref: "#/components/schemas/UpdateQueuePayloadDto"
 *     responses:
 *       200:
 *         description: Queue Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
  "/:oid",
  validateRequest(updateQueueDto),
  roleGuard("Admin"),
  queueController.update
);

/**
 * @openapi
 * /queue/delete/{oid}:
 *   delete:
 *     tags: [Queue]
 *     summary: Delete Queue
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueSuccessCRUDResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete(
  "/delete/:oid",
  validateRequest(deleteQueueDto),
  roleGuard("Admin"),
  queueController.remove
);

/**
 * @openapi
 * /queue:
 *   get:
 *     tags: [Queue]
 *     summary: Get All Queues
 *     responses:
 *       200:
 *         description: List of Queues
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/",
  validateRequest(filterQueueDto),
  roleGuard("Admin"),
  queueController.findAll
);

/**
 * @openapi
 * /queue/q:
 *   post:
 *     tags: [Queue]
 *     summary: Paginated Queues
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterQueuePayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Queues List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueListSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/q",
  validateRequest(filterQueueDto),
  roleGuard("Admin"),
  queueController.find
);

/**
 * @openapi
 * /queue/{oid}:
 *   get:
 *     tags: [Queue]
 *     summary: Get Queue By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QueueSuccessResponse"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  "/:oid",
  validateRequest(getQueueDto),
  roleGuard("Admin"),
  queueController.findById
);


module.exports = router;
