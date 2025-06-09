// src/controllers/payment.controller.js
const paymentService = require('../services/payment.service');
const CreatePaymentDTO = require('../dtos/createPayment.dto');
const PaymentResponseDTO = require('../dtos/paymentResponse.dto');

class PaymentController {
  async create(req, res) {
    try {
      const dto = CreatePaymentDTO.validate(req.body);
      const payment = await paymentService.createPayment(dto);
      res.status(201).json(new PaymentResponseDTO(payment));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async findAll(req, res) {
    try {
      const payments = await paymentService.getAllPayments();
      res.json(payments.map(p => new PaymentResponseDTO(p)));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  }

  async findOne(req, res) {
    try {
      const payment = await paymentService.getPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(new PaymentResponseDTO(payment));
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch payment' });
    }
  }

  async update(req, res) {
    try {
      const updated = await paymentService.updatePayment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.json(new PaymentResponseDTO(updated));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await paymentService.deletePayment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete payment' });
    }
  }
}

module.exports = new PaymentController();
