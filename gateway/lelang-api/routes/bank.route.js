const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const bankController = require("../controllers/bank.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBankDto,
  updateBankDto,
  deleteBankDto,
  getBankDto, filterBankDto, bankResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-bank-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBankPayloadSchema } = j2s(createDto);
const { swagger: UpdateBankPayloadSchema } = j2s(updateDto);
const { swagger: DeleteBankPayloadSchema } = j2s(params);
const { swagger: FilterBankPayloadSchema } = j2s(filterDto);
const { swagger: BankSuccessSchema } = j2s(successResponse(bankResponseDto));
const { swagger: BankListSuccessSchema } = j2s(
  successResponse(Joi.array().items(bankResponseDto))
);


// Response Schema (success + error)

const { swagger: BankSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBankPayloadDto = CreateBankPayloadSchema;
global.swaggerComponents.FilterBankPayloadDto = FilterBankPayloadSchema;
global.swaggerComponents.UpdateBankPayloadDto = UpdateBankPayloadSchema;
global.swaggerComponents.DeleteBankPayloadDto = DeleteBankPayloadSchema;
global.swaggerComponents.BankListSuccessResponse = BankListSuccessSchema;
global.swaggerComponents.BankSuccessResponse = BankSuccessSchema;
global.swaggerComponents.BankSuccessCRUDResponse = BankSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /bank/create:
 *   post:
 *     tags:
 *       - Bank
 *     summary: Create Bank
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBankPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankSuccessCRUDResponse"
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
  validateRequest(createBankDto),
  roleGuard("Admin"),
  bankController.create
);


/**
 * @openapi
 * /bank/{oid}:
 *   put:
 *     tags: [Bank]
 *     summary: Update Bank
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
 *             $ref: "#/components/schemas/UpdateBankPayloadDto"
 *     responses:
 *       200:
 *         description: Bank Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankSuccessCRUDResponse"
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
  validateRequest(updateBankDto),
  roleGuard("Admin"),
  bankController.update
);

/**
 * @openapi
 * /bank/delete/{oid}:
 *   delete:
 *     tags: [Bank]
 *     summary: Delete Bank
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
 *         description: Bank Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankSuccessCRUDResponse"
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
  validateRequest(deleteBankDto),
  roleGuard("Admin"),
  bankController.remove
);

/**
 * @openapi
 * /bank:
 *   get:
 *     tags: [Bank]
 *     summary: Get All Banks
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Banks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankListSuccessResponse"
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
  validateRequest(filterBankDto),
  roleGuard("Admin"),
  bankController.findAll
);

/**
 * @openapi
 * /bank/q:
 *   post:
 *     tags: [Bank]
 *     summary: Paginated Banks
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
 *           enum: [bankName]
 *           default: bankName
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
 *             $ref: "#/components/schemas/FilterBankPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Banks List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankListSuccessResponse"
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
  validateRequest(filterBankDto),
  roleGuard("Admin"),
  bankController.find
);

/**
 * @openapi
 * /bank/{oid}:
 *   get:
 *     tags: [Bank]
 *     summary: Get Bank By ID
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
 *         description: Bank Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BankSuccessResponse"
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
  validateRequest(getBankDto),
  roleGuard("Admin"),
  bankController.findById
);


module.exports = router;
