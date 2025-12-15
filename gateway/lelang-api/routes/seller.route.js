const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const sellerController = require("../controllers/seller.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createSellerDto,
  updateSellerDto,
  deleteSellerDto,
  getSellerDto, filterSellerDto, filterSellerQueryDto,sellerResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-seller-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateSellerPayloadSchema } = j2s(createDto);
const { swagger: UpdateSellerPayloadSchema } = j2s(updateDto);
const { swagger: DeleteSellerPayloadSchema } = j2s(params);
const { swagger: FilterSellerPayloadSchema } = j2s(filterDto);
const { swagger: SellerSuccessSchema } = j2s(successResponse(sellerResponseDto));
const { swagger: SellerListSuccessSchema } = j2s(
  successResponse(Joi.array().items(sellerResponseDto))
);


// Response Schema (success + error)

const { swagger: SellerSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateSellerPayloadDto = CreateSellerPayloadSchema;
global.swaggerComponents.FilterSellerPayloadDto = FilterSellerPayloadSchema;
global.swaggerComponents.UpdateSellerPayloadDto = UpdateSellerPayloadSchema;
global.swaggerComponents.DeleteSellerPayloadDto = DeleteSellerPayloadSchema;
global.swaggerComponents.SellerListSuccessResponse = SellerListSuccessSchema;
global.swaggerComponents.SellerSuccessResponse = SellerSuccessSchema;
global.swaggerComponents.SellerSuccessCRUDResponse = SellerSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /seller/create:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Create Seller
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateSellerPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerSuccessCRUDResponse"
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
  validateRequest(createSellerDto),
  roleGuard("Admin"),
  sellerController.create
);


/**
 * @openapi
 * /seller/{oid}:
 *   put:
 *     tags: [Seller]
 *     summary: Update Seller
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
 *             $ref: "#/components/schemas/UpdateSellerPayloadDto"
 *     responses:
 *       200:
 *         description: Seller Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerSuccessCRUDResponse"
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
  validateRequest(updateSellerDto),
  roleGuard("Admin"),
  sellerController.update
);

/**
 * @openapi
 * /seller/delete/{oid}:
 *   delete:
 *     tags: [Seller]
 *     summary: Delete Seller
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
 *         description: Seller Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerSuccessCRUDResponse"
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
  validateRequest(deleteSellerDto),
  roleGuard("Admin"),
  sellerController.remove
);

/**
 * @openapi
 * /seller:
 *   get:
 *     tags: [Seller]
 *     summary: Get All Sellers
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
 *         description: List of Sellers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerListSuccessResponse"
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
  validateRequest(filterSellerDto),
  roleGuard("Admin"),
  sellerController.findAll
);

/**
 * @openapi
 * /seller/q:
 *   post:
 *     tags: [Seller]
 *     summary: Paginated Sellers
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
 *           enum: [sellerName]
 *           default: sellerName
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
 *             $ref: "#/components/schemas/FilterSellerPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Sellers List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerListSuccessResponse"
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
  validateRequest(filterSellerQueryDto),
  roleGuard("Admin"),
  sellerController.find
);

/**
 * @openapi
 * /seller/{oid}:
 *   get:
 *     tags: [Seller]
 *     summary: Get Seller By ID
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
 *         description: Seller Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SellerSuccessResponse"
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
  validateRequest(getSellerDto),
  roleGuard("Admin"),
  sellerController.findById
);


module.exports = router;
