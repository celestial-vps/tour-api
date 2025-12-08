const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const bidderController = require("../controllers/bidder.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBidderDto,
  updateBidderDto,
  deleteBidderDto,
  getBidderDto, filterBidderDto, bidderResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-bidder-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBidderPayloadSchema } = j2s(createDto);
const { swagger: UpdateBidderPayloadSchema } = j2s(updateDto);
const { swagger: DeleteBidderPayloadSchema } = j2s(params);
const { swagger: FilterBidderPayloadSchema } = j2s(filterDto);
const { swagger: BidderSuccessSchema } = j2s(successResponse(bidderResponseDto));
const { swagger: BidderListSuccessSchema } = j2s(
  successResponse(Joi.array().items(bidderResponseDto))
);


// Response Schema (success + error)

const { swagger: BidderSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBidderPayloadDto = CreateBidderPayloadSchema;
global.swaggerComponents.FilterBidderPayloadDto = FilterBidderPayloadSchema;
global.swaggerComponents.UpdateBidderPayloadDto = UpdateBidderPayloadSchema;
global.swaggerComponents.DeleteBidderPayloadDto = DeleteBidderPayloadSchema;
global.swaggerComponents.BidderListSuccessResponse = BidderListSuccessSchema;
global.swaggerComponents.BidderSuccessResponse = BidderSuccessSchema;
global.swaggerComponents.BidderSuccessCRUDResponse = BidderSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /bidder/create:
 *   post:
 *     tags:
 *       - Bidder
 *     summary: Create Bidder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBidderPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderSuccessCRUDResponse"
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
  validateRequest(createBidderDto),
  roleGuard("Admin"),
  bidderController.create
);


/**
 * @openapi
 * /bidder/{oid}:
 *   put:
 *     tags: [Bidder]
 *     summary: Update Bidder
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
 *             $ref: "#/components/schemas/UpdateBidderPayloadDto"
 *     responses:
 *       200:
 *         description: Bidder Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderSuccessCRUDResponse"
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
  validateRequest(updateBidderDto),
  roleGuard("Admin"),
  bidderController.update
);

/**
 * @openapi
 * /bidder/delete/{oid}:
 *   delete:
 *     tags: [Bidder]
 *     summary: Delete Bidder
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bidder Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderSuccessCRUDResponse"
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
  validateRequest(deleteBidderDto),
  roleGuard("Admin"),
  bidderController.remove
);

/**
 * @openapi
 * /bidder:
 *   get:
 *     tags: [Bidder]
 *     summary: Get All Bidders
 *     responses:
 *       200:
 *         description: List of Bidders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderListSuccessResponse"
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
  validateRequest(filterBidderDto),
  roleGuard("Admin"),
  bidderController.findAll
);

/**
 * @openapi
 * /bidder/q:
 *   post:
 *     tags: [Bidder]
 *     summary: Paginated Bidders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterBidderPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Bidders List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderListSuccessResponse"
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
  validateRequest(filterBidderDto),
  roleGuard("Admin"),
  bidderController.find
);

/**
 * @openapi
 * /bidder/{oid}:
 *   get:
 *     tags: [Bidder]
 *     summary: Get Bidder By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bidder Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidderSuccessResponse"
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
  validateRequest(getBidderDto),
  roleGuard("Admin"),
  bidderController.findById
);


module.exports = router;
