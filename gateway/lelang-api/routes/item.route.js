const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const itemController = require("../controllers/item.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createItemDto,
  updateItemDto,
  deleteItemDto,
  getItemDto, filterItemDto, itemResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-item-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateItemPayloadSchema } = j2s(createDto);
const { swagger: UpdateItemPayloadSchema } = j2s(updateDto);
const { swagger: DeleteItemPayloadSchema } = j2s(params);
const { swagger: FilterItemPayloadSchema } = j2s(filterDto);
const { swagger: ItemSuccessSchema } = j2s(successResponse(itemResponseDto));
const { swagger: ItemListSuccessSchema } = j2s(
  successResponse(Joi.array().items(itemResponseDto))
);


// Response Schema (success + error)

const { swagger: ItemSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateItemPayloadDto = CreateItemPayloadSchema;
global.swaggerComponents.FilterItemPayloadDto = FilterItemPayloadSchema;
global.swaggerComponents.UpdateItemPayloadDto = UpdateItemPayloadSchema;
global.swaggerComponents.DeleteItemPayloadDto = DeleteItemPayloadSchema;
global.swaggerComponents.ItemListSuccessResponse = ItemListSuccessSchema;
global.swaggerComponents.ItemSuccessResponse = ItemSuccessSchema;
global.swaggerComponents.ItemSuccessCRUDResponse = ItemSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /item/create:
 *   post:
 *     tags:
 *       - Item
 *     summary: Create Item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateItemPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemSuccessCRUDResponse"
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
  validateRequest(createItemDto),
  roleGuard("Admin"),
  itemController.create
);


/**
 * @openapi
 * /item/{oid}:
 *   put:
 *     tags: [Item]
 *     summary: Update Item
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
 *             $ref: "#/components/schemas/UpdateItemPayloadDto"
 *     responses:
 *       200:
 *         description: Item Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemSuccessCRUDResponse"
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
  validateRequest(updateItemDto),
  roleGuard("Admin"),
  itemController.update
);

/**
 * @openapi
 * /item/delete/{oid}:
 *   delete:
 *     tags: [Item]
 *     summary: Delete Item
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemSuccessCRUDResponse"
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
  validateRequest(deleteItemDto),
  roleGuard("Admin"),
  itemController.remove
);

/**
 * @openapi
 * /item:
 *   get:
 *     tags: [Item]
 *     summary: Get All Items
 *     responses:
 *       200:
 *         description: List of Items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemListSuccessResponse"
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
  validateRequest(filterItemDto),
  roleGuard("Admin"),
  itemController.findAll
);

/**
 * @openapi
 * /item/q:
 *   post:
 *     tags: [Item]
 *     summary: Paginated Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterItemPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Items List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemListSuccessResponse"
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
  validateRequest(filterItemDto),
  roleGuard("Admin"),
  itemController.find
);

/**
 * @openapi
 * /item/{oid}:
 *   get:
 *     tags: [Item]
 *     summary: Get Item By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemSuccessResponse"
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
  validateRequest(getItemDto),
  roleGuard("Admin"),
  itemController.findById
);


module.exports = router;
