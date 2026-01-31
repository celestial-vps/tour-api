const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const departementController = require("../controllers/departement.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createDepartementDto,
  updateDepartementDto,
  deleteDepartementDto,
  getDepartementDto, filterDepartementDto, filterDepartementQueryDto,departementResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-departement-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateDepartementPayloadSchema } = j2s(createDto);
const { swagger: UpdateDepartementPayloadSchema } = j2s(updateDto);
const { swagger: DeleteDepartementPayloadSchema } = j2s(params);
const { swagger: FilterDepartementPayloadSchema } = j2s(filterDto);
const { swagger: DepartementSuccessSchema } = j2s(successResponse(departementResponseDto));
const { swagger: DepartementListSuccessSchema } = j2s(
  successResponse(Joi.array().items(departementResponseDto))
);


// Response Schema (success + error)

const { swagger: DepartementSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateDepartementPayloadDto = CreateDepartementPayloadSchema;
global.swaggerComponents.FilterDepartementPayloadDto = FilterDepartementPayloadSchema;
global.swaggerComponents.UpdateDepartementPayloadDto = UpdateDepartementPayloadSchema;
global.swaggerComponents.DeleteDepartementPayloadDto = DeleteDepartementPayloadSchema;
global.swaggerComponents.DepartementListSuccessResponse = DepartementListSuccessSchema;
global.swaggerComponents.DepartementSuccessResponse = DepartementSuccessSchema;
global.swaggerComponents.DepartementSuccessCRUDResponse = DepartementSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /departement/create:
 *   post:
 *     tags:
 *       - Departement
 *     summary: Create Departement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateDepartementPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementSuccessCRUDResponse"
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
  validateRequest(createDepartementDto),
  roleGuard("Admin"),
  departementController.create
);


/**
 * @openapi
 * /departement/{oid}:
 *   put:
 *     tags: [Departement]
 *     summary: Update Departement
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
 *             $ref: "#/components/schemas/UpdateDepartementPayloadDto"
 *     responses:
 *       200:
 *         description: Departement Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementSuccessCRUDResponse"
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
  validateRequest(updateDepartementDto),
  roleGuard("Admin"),
  departementController.update
);

/**
 * @openapi
 * /departement/delete/{oid}:
 *   delete:
 *     tags: [Departement]
 *     summary: Delete Departement
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Departement Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementSuccessCRUDResponse"
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
  validateRequest(deleteDepartementDto),
  roleGuard("Admin"),
  departementController.remove
);

/**
 * @openapi
 * /departement:
 *   get:
 *     tags: [Departement]
 *     summary: Get All Departements
 *     responses:
 *       200:
 *         description: List of Departements
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementListSuccessResponse"
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
  validateRequest(filterDepartementQueryDto),
  roleGuard("Admin"),
  departementController.findAll
);

/**
 * @openapi
 * /departement/q:
 *   post:
 *     tags: [Departement]
 *     summary: Paginated Departements
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterDepartementPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Departements List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementListSuccessResponse"
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
  validateRequest(filterDepartementDto),
  roleGuard("Admin"),
  departementController.find
);

/**
 * @openapi
 * /departement/{oid}:
 *   get:
 *     tags: [Departement]
 *     summary: Get Departement By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Departement Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DepartementSuccessResponse"
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
  validateRequest(getDepartementDto),
  roleGuard("Admin"),
  departementController.findById
);


module.exports = router;
