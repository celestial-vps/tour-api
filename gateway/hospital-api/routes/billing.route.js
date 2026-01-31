const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const billingController = require("../controllers/billing.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBillingDto,
  updateBillingDto,
  deleteBillingDto,
  getBillingDto, filterBillingDto, billingResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-billing-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBillingPayloadSchema } = j2s(createDto);
const { swagger: UpdateBillingPayloadSchema } = j2s(updateDto);
const { swagger: DeleteBillingPayloadSchema } = j2s(params);
const { swagger: FilterBillingPayloadSchema } = j2s(filterDto);
const { swagger: BillingSuccessSchema } = j2s(successResponse(billingResponseDto));
const { swagger: BillingListSuccessSchema } = j2s(
  successResponse(Joi.array().items(billingResponseDto))
);


// Response Schema (success + error)

const { swagger: BillingSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBillingPayloadDto = CreateBillingPayloadSchema;
global.swaggerComponents.FilterBillingPayloadDto = FilterBillingPayloadSchema;
global.swaggerComponents.UpdateBillingPayloadDto = UpdateBillingPayloadSchema;
global.swaggerComponents.DeleteBillingPayloadDto = DeleteBillingPayloadSchema;
global.swaggerComponents.BillingListSuccessResponse = BillingListSuccessSchema;
global.swaggerComponents.BillingSuccessResponse = BillingSuccessSchema;
global.swaggerComponents.BillingSuccessCRUDResponse = BillingSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /billing/create:
 *   post:
 *     tags:
 *       - Billing
 *     summary: Create Billing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBillingPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingSuccessCRUDResponse"
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
  validateRequest(createBillingDto),
  roleGuard("Admin"),
  billingController.create
);


/**
 * @openapi
 * /billing/{oid}:
 *   put:
 *     tags: [Billing]
 *     summary: Update Billing
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
 *             $ref: "#/components/schemas/UpdateBillingPayloadDto"
 *     responses:
 *       200:
 *         description: Billing Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingSuccessCRUDResponse"
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
  validateRequest(updateBillingDto),
  roleGuard("Admin"),
  billingController.update
);

/**
 * @openapi
 * /billing/delete/{oid}:
 *   delete:
 *     tags: [Billing]
 *     summary: Delete Billing
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billing Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingSuccessCRUDResponse"
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
  validateRequest(deleteBillingDto),
  roleGuard("Admin"),
  billingController.remove
);

/**
 * @openapi
 * /billing:
 *   get:
 *     tags: [Billing]
 *     summary: Get All Billings
 *     responses:
 *       200:
 *         description: List of Billings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingListSuccessResponse"
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
  validateRequest(filterBillingDto),
  roleGuard("Admin"),
  billingController.findAll
);

/**
 * @openapi
 * /billing/q:
 *   post:
 *     tags: [Billing]
 *     summary: Paginated Billings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterBillingPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Billings List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingListSuccessResponse"
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
  validateRequest(filterBillingDto),
  roleGuard("Admin"),
  billingController.find
);

/**
 * @openapi
 * /billing/{oid}:
 *   get:
 *     tags: [Billing]
 *     summary: Get Billing By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Billing Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BillingSuccessResponse"
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
  validateRequest(getBillingDto),
  roleGuard("Admin"),
  billingController.findById
);


module.exports = router;
