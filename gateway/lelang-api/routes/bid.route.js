const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const bidController = require("../controllers/bid.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBidDto,
  updateBidDto,
  deleteBidDto,
  getBidDto, filterBidDto, bidResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-bid-dto");

// Response DTO
const { successResponse, errorResponse } = require("../dtos/response.dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBidPayloadSchema } = j2s(createDto);
const { swagger: UpdateBidPayloadSchema } = j2s(updateDto);
const { swagger: DeleteBidPayloadSchema } = j2s(params);
const { swagger: FilterBidPayloadSchema } = j2s(filterDto);
const { swagger: BidSuccessSchema } = j2s(successResponse(bidResponseDto));
const { swagger: BidListSuccessSchema } = j2s(
  successResponse(Joi.array().items(bidResponseDto))
);


// Response Schema (success + error)

const { swagger: BidSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBidPayloadDto = CreateBidPayloadSchema;
global.swaggerComponents.FilterBidPayloadDto = FilterBidPayloadSchema;
global.swaggerComponents.UpdateBidPayloadDto = UpdateBidPayloadSchema;
global.swaggerComponents.DeleteBidPayloadDto = DeleteBidPayloadSchema;
global.swaggerComponents.BidListSuccessResponse = BidListSuccessSchema;
global.swaggerComponents.BidSuccessResponse = BidSuccessSchema;
global.swaggerComponents.BidSuccessCRUDResponse = BidSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /bid/create:
 *   post:
 *     tags:
 *       - Bid
 *     summary: Create Bid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBidPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidSuccessCRUDResponse"
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
  validateRequest(createBidDto),
  roleGuard("Admin"),
  bidController.create
);


/**
 * @openapi
 * /bid/{oid}:
 *   put:
 *     tags: [Bid]
 *     summary: Update Bid
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
 *             $ref: "#/components/schemas/UpdateBidPayloadDto"
 *     responses:
 *       200:
 *         description: Bid Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidSuccessCRUDResponse"
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
  validateRequest(updateBidDto),
  roleGuard("Admin"),
  bidController.update
);

/**
 * @openapi
 * /bid/delete/{oid}:
 *   delete:
 *     tags: [Bid]
 *     summary: Delete Bid
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidSuccessCRUDResponse"
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
  validateRequest(deleteBidDto),
  roleGuard("Admin"),
  bidController.remove
);

/**
 * @openapi
 * /bid:
 *   get:
 *     tags: [Bid]
 *     summary: Get All Bids
 *     responses:
 *       200:
 *         description: List of Bids
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidListSuccessResponse"
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
  validateRequest(filterBidDto),
  roleGuard("Admin"),
  bidController.findAll
);

/**
 * @openapi
 * /bid/q:
 *   post:
 *     tags: [Bid]
 *     summary: Paginated Bids
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterBidPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Bids List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidListSuccessResponse"
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
  validateRequest(filterBidDto),
  roleGuard("Admin"),
  bidController.find
);

/**
 * @openapi
 * /bid/{oid}:
 *   get:
 *     tags: [Bid]
 *     summary: Get Bid By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bid Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BidSuccessResponse"
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
  validateRequest(getBidDto),
  roleGuard("Admin"),
  bidController.findById
);


module.exports = router;
