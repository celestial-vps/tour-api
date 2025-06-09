// src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/', paymentController.create);
router.get('/', paymentController.findAll);
router.get('/:id', paymentController.findOne);
router.put('/:id', paymentController.update);
router.delete('/:id', paymentController.delete);

module.exports = router;
