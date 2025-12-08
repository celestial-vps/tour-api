const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const roomController = require("../controllers/room.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createRoomDto,
  updateRoomDto,
  deleteRoomDto,
  getRoomDto, filterRoomDto, roomResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-room-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateRoomPayloadSchema } = j2s(createDto);
const { swagger: UpdateRoomPayloadSchema } = j2s(updateDto);
const { swagger: DeleteRoomPayloadSchema } = j2s(params);
const { swagger: FilterRoomPayloadSchema } = j2s(filterDto);
const { swagger: RoomSuccessSchema } = j2s(successResponse(roomResponseDto));
const { swagger: RoomListSuccessSchema } = j2s(
  successResponse(Joi.array().items(roomResponseDto))
);


// Response Schema (success + error)

const { swagger: RoomSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateRoomPayloadDto = CreateRoomPayloadSchema;
global.swaggerComponents.FilterRoomPayloadDto = FilterRoomPayloadSchema;
global.swaggerComponents.UpdateRoomPayloadDto = UpdateRoomPayloadSchema;
global.swaggerComponents.DeleteRoomPayloadDto = DeleteRoomPayloadSchema;
global.swaggerComponents.RoomListSuccessResponse = RoomListSuccessSchema;
global.swaggerComponents.RoomSuccessResponse = RoomSuccessSchema;
global.swaggerComponents.RoomSuccessCRUDResponse = RoomSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /room/create:
 *   post:
 *     tags:
 *       - Room
 *     summary: Create Room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateRoomPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomSuccessCRUDResponse"
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
  validateRequest(createRoomDto),
  roleGuard("Admin"),
  roomController.create
);


/**
 * @openapi
 * /room/{oid}:
 *   put:
 *     tags: [Room]
 *     summary: Update Room
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
 *             $ref: "#/components/schemas/UpdateRoomPayloadDto"
 *     responses:
 *       200:
 *         description: Room Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomSuccessCRUDResponse"
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
  validateRequest(updateRoomDto),
  roleGuard("Admin"),
  roomController.update
);

/**
 * @openapi
 * /room/delete/{oid}:
 *   delete:
 *     tags: [Room]
 *     summary: Delete Room
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomSuccessCRUDResponse"
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
  validateRequest(deleteRoomDto),
  roleGuard("Admin"),
  roomController.remove
);

/**
 * @openapi
 * /room:
 *   get:
 *     tags: [Room]
 *     summary: Get All Rooms
 *     responses:
 *       200:
 *         description: List of Rooms
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomListSuccessResponse"
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
  validateRequest(filterRoomDto),
  roleGuard("Admin"),
  roomController.findAll
);

/**
 * @openapi
 * /room/q:
 *   post:
 *     tags: [Room]
 *     summary: Paginated Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterRoomPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Rooms List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomListSuccessResponse"
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
  validateRequest(filterRoomDto),
  roleGuard("Admin"),
  roomController.find
);

/**
 * @openapi
 * /room/{oid}:
 *   get:
 *     tags: [Room]
 *     summary: Get Room By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RoomSuccessResponse"
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
  validateRequest(getRoomDto),
  roleGuard("Admin"),
  roomController.findById
);


module.exports = router;
