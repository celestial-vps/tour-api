const express = require("express");
const { roleGuard } = require("../middleware/role-guard");
const { validateRequest } = require("../misc/validation");
const doctorController = require("../controllers/doctor.controller");
const j2s = require("joi-to-swagger");
const Joi = require("joi");

// Payload DTO
const {
  createDoctorDto,
  updateDoctorDto,
  deleteDoctorDto,
  getDoctorDto, filterDoctorDto, doctorResponseDto, createDto, updateDto, filterDto, params
} = require("../dtos/payload-doctor-dto");
 
// Response DTO
const { successResponse, errorResponse } = require("../dtos/response-dto");

// Message DTO
const { messageDto } = require("../dtos/message-dto");

// ---- Convert Joi to Swagger ----
const { swagger: CreateDoctorPayloadSchema } = j2s(createDto);
const { swagger: UpdateDoctorPayloadSchema } = j2s(updateDto);
const { swagger: DeleteDoctorPayloadSchema } = j2s(params);
const { swagger: FilterDoctorPayloadSchema } = j2s(filterDto);
const { swagger: DoctorSuccessSchema } = j2s(successResponse(doctorResponseDto));
const { swagger: DoctorListSuccessSchema } = j2s(
  successResponse(Joi.array().items(doctorResponseDto))
);


// Response Schema (success + error)

const { swagger: DoctorSuccessCRUDSchema } = j2s(successResponse(messageDto));
const { swagger: ErrorSchema } = j2s(errorResponse);

// ---- Register to components (global) ----
global.swaggerComponents ??= {};
global.swaggerComponents.CreateDoctorPayloadDto = CreateDoctorPayloadSchema;
global.swaggerComponents.FilterDoctorPayloadDto = FilterDoctorPayloadSchema;
global.swaggerComponents.UpdateDoctorPayloadDto = UpdateDoctorPayloadSchema;
global.swaggerComponents.DeleteDoctorPayloadDto = DeleteDoctorPayloadSchema;
global.swaggerComponents.DoctorListSuccessResponse = DoctorListSuccessSchema;
global.swaggerComponents.DoctorSuccessResponse = DoctorSuccessSchema;
global.swaggerComponents.DoctorSuccessCRUDResponse = DoctorSuccessCRUDSchema;
global.swaggerComponents.ErrorResponse = ErrorSchema;

const router = express.Router();

/**
 * @openapi
 * /doctor/create:
 *   post:
 *     tags:
 *       - Doctor
 *     summary: Create Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateDoctorPayloadDto"
 *     responses:
 *       201:
 *         description: Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorSuccessCRUDResponse"
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
  validateRequest(createDoctorDto),
  roleGuard("Admin"),
  doctorController.create
);


/**
 * @openapi
 * /doctor/{oid}:
 *   put:
 *     tags: [Doctor]
 *     summary: Update Doctor
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
 *             $ref: "#/components/schemas/UpdateDoctorPayloadDto"
 *     responses:
 *       200:
 *         description: Doctor Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorSuccessCRUDResponse"
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
  validateRequest(updateDoctorDto),
  roleGuard("Admin"),
  doctorController.update
);

/**
 * @openapi
 * /doctor/delete/{oid}:
 *   delete:
 *     tags: [Doctor]
 *     summary: Delete Doctor
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorSuccessCRUDResponse"
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
  validateRequest(deleteDoctorDto),
  roleGuard("Admin"),
  doctorController.remove
);

/**
 * @openapi
 * /doctor:
 *   get:
 *     tags: [Doctor]
 *     summary: Get All Doctors
 *     responses:
 *       200:
 *         description: List of Doctors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorListSuccessResponse"
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
  validateRequest(filterDoctorDto),
  roleGuard("Admin"),
  doctorController.findAll
);

/**
 * @openapi
 * /doctor/q:
 *   post:
 *     tags: [Doctor]
 *     summary: Paginated Doctors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FilterDoctorPayloadDto"
 *     responses:
 *       200:
 *         description: Paginated Doctors List
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorListSuccessResponse"
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
  validateRequest(filterDoctorDto),
  roleGuard("Admin"),
  doctorController.find
);

/**
 * @openapi
 * /doctor/{oid}:
 *   get:
 *     tags: [Doctor]
 *     summary: Get Doctor By ID
 *     parameters:
 *       - name: oid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor Detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DoctorSuccessResponse"
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
  validateRequest(getDoctorDto),
  roleGuard("Admin"),
  doctorController.findById
);


module.exports = router;
