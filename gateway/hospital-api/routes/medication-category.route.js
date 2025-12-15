const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const medicationCategoryController = require("../controllers/medication-category.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createMedicationCategoryDto,
  updateMedicationCategoryDto,
  deleteMedicationCategoryDto,
  getMedicationCategoryDto, filterMedicationCategoryDto, medicationCategoryResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-medication-category-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateMedicationCategoryPayloadSchema } = j2s(createDto);
const { swagger: UpdateMedicationCategoryPayloadSchema } = j2s(updateDto);
const { swagger: DeleteMedicationCategoryPayloadSchema } = j2s(params);
const { swagger: FilterMedicationCategoryPayloadSchema } = j2s(filterDto);
const { swagger: MedicationCategorySuccessSchema } = j2s(successResponse(medicationCategoryResponseDto));
const { swagger: MedicationCategoryListSuccessSchema } = j2s(
  successResponse(Joi.array().items(medicationCategoryResponseDto))
);


// Response Schema (success + error)

const { swagger: MedicationCategorySuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateMedicationCategoryPayloadDto = CreateMedicationCategoryPayloadSchema;
global.swaggerComponents.FilterMedicationCategoryPayloadDto = FilterMedicationCategoryPayloadSchema;
global.swaggerComponents.UpdateMedicationCategoryPayloadDto = UpdateMedicationCategoryPayloadSchema;
global.swaggerComponents.DeleteMedicationCategoryPayloadDto = DeleteMedicationCategoryPayloadSchema;
global.swaggerComponents.MedicationCategoryListSuccessResponse = MedicationCategoryListSuccessSchema;
global.swaggerComponents.MedicationCategorySuccessResponse = MedicationCategorySuccessSchema;
global.swaggerComponents.MedicationCategorySuccessCRUDResponse = MedicationCategorySuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /medication-category/create:
 *   post:
 *     tags:
 *       - Medication Category
 *     summary: Create Medication Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateMedicationCategoryPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategorySuccessCRUDResponse"
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
  validateRequest(createMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.create
);


/**
 * @openapi
 * /medication-category/{oid}:
 *   put:
 *     tags: [Medication Category]
 *     summary: Update Medication Category
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
 *             $ref: "#/components/schemas/UpdateMedicationCategoryPayloadDto"
 *     responses:
 *       200:
 *         description: MedicationCategory Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategorySuccessCRUDResponse"
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
  validateRequest(updateMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.update
);

/**
 * @openapi
 * /medication-category/delete/{oid}:
 *   delete:
 *     tags: [Medication Category]
 *     summary: Delete Medication Category
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MedicationCategory Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategorySuccessCRUDResponse"
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
  validateRequest(deleteMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.remove
);

/**
 * @openapi
 * /medication-category:
 *   get:
 *     tags: [Medication Category]
 *     summary: Get All Medication Categorys
 *     responses:
 *       200:
 *         description: List of MedicationCategorys
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategoryListSuccessResponse"
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
  validateRequest(filterMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.findAll
);

/**
 * @openapi
 * /medication-category/q:
 *   post:
 *     tags: [Medication Category]
 *     summary: Paginated Medication Categorys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterMedicationCategoryPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated MedicationCategorys List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategoryListSuccessResponse"
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
  validateRequest(filterMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.find
);

/**
 * @openapi
 * /medication-category/{oid}:
 *   get:
 *     tags: [Medication Category]
 *     summary: Get Medication Category By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MedicationCategory Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MedicationCategorySuccessResponse"
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
  validateRequest(getMedicationCategoryDto),
  roleGuard("Admin"),
  medicationCategoryController.findById
);


module.exports = router;
