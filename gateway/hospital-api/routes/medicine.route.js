const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const medicineController = require("../controllers/medicine.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createBMedicineDto,
  updateBMedicineDto,
  deleteBMedicineDto,
  getBMedicineDto, filterBMedicineDto, medicineResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-medicine-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateBMedicinePayloadSchema } = j2s(createDto);
const { swagger: UpdateBMedicinePayloadSchema } = j2s(updateDto);
const { swagger: DeleteBMedicinePayloadSchema } = j2s(params);
const { swagger: FilterBMedicinePayloadSchema } = j2s(filterDto);
const { swagger: BMedicineSuccessSchema } = j2s(successResponse(medicineResponseDto));
const { swagger: BMedicineListSuccessSchema } = j2s(
  successResponse(Joi.array().items(medicineResponseDto))
);


// Response Schema (success + error)

const { swagger: BMedicineSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateBMedicinePayloadDto = CreateBMedicinePayloadSchema;
global.swaggerComponents.FilterBMedicinePayloadDto = FilterBMedicinePayloadSchema;
global.swaggerComponents.UpdateBMedicinePayloadDto = UpdateBMedicinePayloadSchema;
global.swaggerComponents.DeleteBMedicinePayloadDto = DeleteBMedicinePayloadSchema;
global.swaggerComponents.BMedicineListSuccessResponse = BMedicineListSuccessSchema;
global.swaggerComponents.BMedicineSuccessResponse = BMedicineSuccessSchema;
global.swaggerComponents.BMedicineSuccessCRUDResponse = BMedicineSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /medicine/create:
 *   post:
 *     tags:
 *       - BMedicine
 *     summary: Create BMedicine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateBMedicinePayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineSuccessCRUDResponse"
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
  validateRequest(createBMedicineDto),
  roleGuard("Admin"),
  medicineController.create
);


/**
 * @openapi
 * /medicine/{oid}:
 *   put:
 *     tags: [BMedicine]
 *     summary: Update BMedicine
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
 *             $ref: "#/components/schemas/UpdateBMedicinePayloadDto"
 *     responses:
 *       200:
 *         description: BMedicine Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineSuccessCRUDResponse"
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
  validateRequest(updateBMedicineDto),
  roleGuard("Admin"),
  medicineController.update
);

/**
 * @openapi
 * /medicine/delete/{oid}:
 *   delete:
 *     tags: [BMedicine]
 *     summary: Delete BMedicine
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: BMedicine Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineSuccessCRUDResponse"
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
  validateRequest(deleteBMedicineDto),
  roleGuard("Admin"),
  medicineController.remove
);

/**
 * @openapi
 * /medicine:
 *   get:
 *     tags: [BMedicine]
 *     summary: Get All BMedicines
 *     responses:
 *       200:
 *         description: List of BMedicines
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineListSuccessResponse"
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
  validateRequest(filterBMedicineDto),
  roleGuard("Admin"),
  medicineController.findAll
);

/**
 * @openapi
 * /medicine/q:
 *   post:
 *     tags: [BMedicine]
 *     summary: Paginated BMedicines
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterBMedicinePayloadDto"
 *     responses:
 *       200:
 *         description: Paginated BMedicines List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineListSuccessResponse"
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
  validateRequest(filterBMedicineDto),
  roleGuard("Admin"),
  medicineController.find
);

/**
 * @openapi
 * /medicine/{oid}:
 *   get:
 *     tags: [BMedicine]
 *     summary: Get BMedicine By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: BMedicine Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BMedicineSuccessResponse"
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
  validateRequest(getBMedicineDto),
  roleGuard("Admin"),
  medicineController.findById
);


module.exports = router;
