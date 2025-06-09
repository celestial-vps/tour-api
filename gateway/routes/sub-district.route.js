// const express = require('express');
// const { roleGuard } = require('../middleware/role-guard');
// const { validateRequest } = require('../misc/validation');
// const {
//   createSubdistrictRequestDto,
//   updateSubdistrictRequestDto,
//   deleteSubdistrictDto,
//   getSubdistrictDto,
//   filterSubdistrictDto
// } = require('../dtos/sub-district-dto');

// const router = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: SubDistrict
//  *     description: Sub-district management operations
//  */

// /**
//  * @swagger
//  * /sub-district/create:
//  *   post:
//  *     tags: [SubDistrict]
//  *     summary: Create a new sub-district
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               districtOid:
//  *                 type: string
//  *                 format: uuid
//  *                 example: "e321da78-51d5-4a78-9335-6bbf1c91b1c2"
//  *               subDistrictName:
//  *                 type: string
//  *                 example: "Kemang"
//  *               postalCode:
//  *                 type: string
//  *                 example: "12730"
//  *     responses:
//  *       200:
//  *         description: Sub-district created successfully
//  */
// router.post(
//   '/create',
//   validateRequest(createSubdistrictRequestDto),
//   roleGuard('Admin'),
//   (req, res) => res.status(200).json({ message: 'Stub for create sub-district' })
// );

// /**
//  * @swagger
//  * /sub-district/{oid}:
//  *   put:
//  *     tags: [SubDistrict]
//  *     summary: Update a sub-district
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *           example: "a4563ea1-1473-4377-a519-75dfc466dc4d"
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               districtOid:
//  *                 type: string
//  *                 format: uuid
//  *               subDistrictName:
//  *                 type: string
//  *               postalCode:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Sub-district updated successfully
//  */
// router.put(
//   '/:oid',
//   validateRequest(updateSubdistrictRequestDto),
//   roleGuard('Admin'),
//   (req, res) => res.status(200).json({ message: 'Stub for update sub-district' })
// );

// /**
//  * @swagger
//  * /sub-district/delete/{oid}:
//  *   delete:
//  *     tags: [SubDistrict]
//  *     summary: Delete a sub-district
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: Sub-district deleted successfully
//  */
// router.delete(
//   '/delete/:oid',
//   validateRequest(deleteSubdistrictDto),
//   roleGuard('Admin'),
//   (req, res) => res.status(200).json({ message: 'Stub for delete sub-district' })
// );

// /**
//  * @swagger
//  * /sub-district/q:
//  *   post:
//  *     tags: [SubDistrict]
//  *     summary: Query sub-districts with filters and pagination
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               districtOid:
//  *                 type: string
//  *                 format: uuid
//  *               subDistrictName:
//  *                 type: string
//  *               postalCode:
//  *                 type: string
//  *               fieldName:
//  *                 type: string
//  *               sortOrder:
//  *                 type: integer
//  *     parameters:
//  *       - name: pageIndex
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: integer
//  *           example: 1
//  *       - name: pageSize
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: integer
//  *           example: 10
//  *     responses:
//  *       200:
//  *         description: List of sub-districts
//  */
// router.post(
//   '/q',
//   validateRequest(filterSubdistrictDto),
//   roleGuard('Admin'),
//   (req, res) => res.status(200).json({ message: 'Stub for filter sub-districts' })
// );

// /**
//  * @swagger
//  * /sub-district/{oid}:
//  *   get:
//  *     tags: [SubDistrict]
//  *     summary: Get sub-district by ID
//  *     parameters:
//  *       - name: oid
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: Sub-district retrieved successfully
//  */
// router.get(
//   '/:oid',
//   validateRequest(getSubdistrictDto),
//   roleGuard('Admin'),
//   (req, res) => res.status(200).json({ message: 'Stub for get sub-district by ID' })
// );

// module.exports = router;
