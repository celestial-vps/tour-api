const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const itemCategoryController = require("../controllers/item-category.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createItemCategoryDto,
  updateItemCategoryDto,
  deleteItemCategoryDto,
  getItemCategoryDto, filterItemCategoryDto,filterItemCategoryQueryDto,
  itemCategoryResponseDto, createDto, updateDto, filterDto, params,
} = require("../dtos/payload-item-category-dto");

// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateItemCategoryPayloadSchema } = j2s(createDto);
const { swagger: UpdateItemCategoryPayloadSchema } = j2s(updateDto);
const { swagger: DeleteItemCategoryPayloadSchema } = j2s(params);
const { swagger: FilterItemCategoryPayloadSchema } = j2s(filterDto);
const { swagger: ItemCategorySuccessSchema } = j2s(successResponse(itemCategoryResponseDto));
const { swagger: ItemCategoryListSuccessSchema } = j2s(
  successResponse(Joi.array().items(itemCategoryResponseDto))
);


// Response Schema (success + error)

const { swagger: ItemCategorySuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateItemCategoryPayloadDto = CreateItemCategoryPayloadSchema;
global.swaggerComponents.FilterItemCategoryPayloadDto = FilterItemCategoryPayloadSchema;
global.swaggerComponents.UpdateItemCategoryPayloadDto = UpdateItemCategoryPayloadSchema;
global.swaggerComponents.DeleteItemCategoryPayloadDto = DeleteItemCategoryPayloadSchema;
global.swaggerComponents.ItemCategoryListSuccessResponse = ItemCategoryListSuccessSchema;
global.swaggerComponents.ItemCategorySuccessResponse = ItemCategorySuccessSchema;
global.swaggerComponents.ItemCategorySuccessCRUDResponse = ItemCategorySuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /item-category/create:
 *   post:
 *     tags:
 *       - Item Category
 *     summary: Create ItemCategory
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateItemCategoryPayloadDto"

 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategorySuccessCRUDResponse"
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
  validateRequest(createItemCategoryDto),
  roleGuard("Admin"),
  itemCategoryController.create
);


/**
 * @openapi
 * /item-category/{oid}:
 *   put:
 *     tags: [Item Category]
 *     summary: Update Item Category
 *     security:
 *       - BearerAuth: []
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
 *             $ref: "#/components/schemas/UpdateItemCategoryPayloadDto"
 *     responses:
 *       200:
 *         description: ItemCategory Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategorySuccessCRUDResponse"
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
  validateRequest(updateItemCategoryDto),
  roleGuard("Admin"),
  itemCategoryController.update
);

/**
 * @openapi
 * /item-category/delete/{oid}:
 *   delete:
 *     tags: [Item Category]
 *     summary: Delete Item Category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ItemCategory Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategorySuccessCRUDResponse"
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
  validateRequest(deleteItemCategoryDto),
  roleGuard("Admin"),
  itemCategoryController.remove
);

/**
 * @openapi
 * /item-category:
 *   get:
 *     tags: [Item Category]
 *     summary: Get All Item Categorys
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           enum: [search]
 *           default: gitar
 *         required: false
 *     responses:
 *       200:
 *         description: List of ItemCategorys
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategoryListSuccessResponse"
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
  validateRequest(filterItemCategoryQueryDto),
  roleGuard("Admin"),
  itemCategoryController.findAll
);

/**
 * @openapi
 * /item-category/q:
 *   post:
 *     tags: [Item Category]
 *     summary: Paginated Item Categorys
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: true
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: true
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [categoryName]
 *           default: categoryName
 *         required: false
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterItemCategoryPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated ItemCategorys List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategoryListSuccessResponse"
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
  validateRequest(filterItemCategoryDto),
  roleGuard("Admin"),
  itemCategoryController.find
);

/**
 * @openapi
 * /item-category/{oid}:
 *   get:
 *     tags: [Item Category]
 *     summary: Get Item Category By ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ItemCategory Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ItemCategorySuccessResponse"
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
  validateRequest(getItemCategoryDto),
  roleGuard("Admin"),
  itemCategoryController.findById
);


module.exports = router;
