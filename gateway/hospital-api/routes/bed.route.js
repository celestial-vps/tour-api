const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const bedController = require("../controllers/bed.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBedDto,
  updateBedDto,
  deleteBedDto,
  getBedDto, filterBedDto, bedResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-bed-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBedPayloadSchema } = j2s(createDto);
const { swagger: UpdateBedPayloadSchema } = j2s(updateDto);
const { swagger: DeleteBedPayloadSchema } = j2s(params);
const { swagger: FilterBedPayloadSchema } = j2s(filterDto);
const { swagger: BedSuccessSchema } = j2s(successResponse(bedResponseDto));
const { swagger: BedListSuccessSchema } = j2s(
  successResponse(Joi.array().items(bedResponseDto))
);


// Response Schema (success + error)

const { swagger: BedSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBedPayloadDto = CreateBedPayloadSchema;
global.swaggerComponents.FilterBedPayloadDto = FilterBedPayloadSchema;
global.swaggerComponents.UpdateBedPayloadDto = UpdateBedPayloadSchema;
global.swaggerComponents.DeleteBedPayloadDto = DeleteBedPayloadSchema;
global.swaggerComponents.BedListSuccessResponse = BedListSuccessSchema;
global.swaggerComponents.BedSuccessResponse = BedSuccessSchema;
global.swaggerComponents.BedSuccessCRUDResponse = BedSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /bed/create:
 *   post:
 *     tags:
 *       - Bed
 *     summary: Create Bed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBedPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedSuccessCRUDResponse"
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
  validateRequest(createBedDto),
  roleGuard("Admin"),
  bedController.create
);


/**
 * @openapi
 * /bed/{oid}:
 *   put:
 *     tags: [Bed]
 *     summary: Update Bed
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
 *             $ref: "#/components/schemas/UpdateBedPayloadDto"
 *     responses:
 *       200:
 *         description: Bed Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedSuccessCRUDResponse"
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
  validateRequest(updateBedDto),
  roleGuard("Admin"),
  bedController.update
);

/**
 * @openapi
 * /bed/delete/{oid}:
 *   delete:
 *     tags: [Bed]
 *     summary: Delete Bed
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bed Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedSuccessCRUDResponse"
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
  validateRequest(deleteBedDto),
  roleGuard("Admin"),
  bedController.remove
);

/**
 * @openapi
 * /bed:
 *   get:
 *     tags: [Bed]
 *     summary: Get All Beds
 *     responses:
 *       200:
 *         description: List of Beds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedListSuccessResponse"
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
  validateRequest(filterBedDto),
  roleGuard("Admin"),
  bedController.findAll
);

/**
 * @openapi
 * /bed/q:
 *   post:
 *     tags: [Bed]
 *     summary: Paginated Beds
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterBedPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Beds List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedListSuccessResponse"
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
  validateRequest(filterBedDto),
  roleGuard("Admin"),
  bedController.find
);

/**
 * @openapi
 * /bed/{oid}:
 *   get:
 *     tags: [Bed]
 *     summary: Get Bed By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bed Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BedSuccessResponse"
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
  validateRequest(getBedDto),
  roleGuard("Admin"),
  bedController.findById
);


module.exports = router;
