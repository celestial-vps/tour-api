const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const auctionController = require("../controllers/auction.controller");
const { validateRequest } = require("../misc/validation");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createAuctionDto,
  updateAuctionDto,
  deleteAuctionDto,
  getAuctionDto,
  filterAuctionDto,
  auctionResponseDto,
  createDto,
  updateDto,
  filterDto,
  params
} = require("../dtos/payload-auction-dto");

// Response DTO
const { successResponse, errorResponse } = require("../dtos/response.dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateAuctionPayloadSchema } = j2s(createDto);
const { swagger: UpdateAuctionPayloadSchema } = j2s(updateDto);
const { swagger: DeleteAuctionPayloadSchema } = j2s(params);
const { swagger: FilterAuctionPayloadSchema } = j2s(filterDto);
const { swagger: AuctionSuccessSchema } = j2s(successResponse(auctionResponseDto));
const { swagger: AuctionListSuccessSchema } = j2s(
  successResponse(Joi.array().items(auctionResponseDto))
);

// Response Schema (success + error)
const { swagger: AuctionSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateAuctionPayloadDto = CreateAuctionPayloadSchema;
global.swaggerComponents.FilterAuctionPayloadDto = FilterAuctionPayloadSchema;
global.swaggerComponents.UpdateAuctionPayloadDto = UpdateAuctionPayloadSchema;
global.swaggerComponents.DeleteAuctionPayloadDto = DeleteAuctionPayloadSchema;
global.swaggerComponents.AuctionListSuccessResponse = AuctionListSuccessSchema;
global.swaggerComponents.AuctionSuccessResponse = AuctionSuccessSchema;
global.swaggerComponents.AuctionSuccessCRUDResponse = AuctionSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /auction/create:
 *   post:
 *     tags: [Auction]
 *     summary: Create Auction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateAuctionPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionSuccessCRUDResponse"
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
  validateRequest(createAuctionDto),
  roleGuard("Admin"),
  auctionController.create
);

/**
 * @openapi
 * /auction/{oid}:
 *   put:
 *     tags: [Auction]
 *     summary: Update Auction
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
 *             $ref: "#/components/schemas/UpdateAuctionPayloadDto"
 *     responses:
 *       200:
 *         description: Auction Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionSuccessCRUDResponse"
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
  validateRequest(updateAuctionDto),
  roleGuard("Admin"),
  auctionController.update
);

/**
 * @openapi
 * /auction/delete/{oid}:
 *   delete:
 *     tags: [Auction]
 *     summary: Delete Auction
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionSuccessCRUDResponse"
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
  validateRequest(deleteAuctionDto),
  roleGuard("Admin"),
  auctionController.remove
);

/**
 * @openapi
 * /auction:
 *   get:
 *     tags: [Auction]
 *     summary: Get All Auctions
 *     responses:
 *       200:
 *         description: List of Auctions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionListSuccessResponse"
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
  validateRequest(filterAuctionDto),
  roleGuard("Admin"),
  auctionController.findAll
);

/**
 * @openapi
 * /auction/q:
 *   post:
 *     tags: [Auction]
 *     summary: Paginated Auctions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterAuctionPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Auctions List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionListSuccessResponse"
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
  validateRequest(filterAuctionDto),
  roleGuard("Admin"),
  auctionController.find
);

/**
 * @openapi
 * /auction/{oid}:
 *   get:
 *     tags: [Auction]
 *     summary: Get Auction By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auction Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuctionSuccessResponse"
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
  validateRequest(getAuctionDto),
  roleGuard("Admin"),
  auctionController.findById
);

module.exports = router;
