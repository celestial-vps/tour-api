// src/services/payment.service.js
const paymentRepository = require('../repositories/payment.repository');

class PaymentService {
  async createPayment(data) {
    return await paymentRepository.create(data);
  }

  async getPayment(id) {
    return await paymentRepository.findById(id);
  }

  async getAllPayments() {
    return await paymentRepository.findAll();
  }

  async updatePayment(id, data) {
    return await paymentRepository.update(id, data);
  }

  async deletePayment(id) {
    return await paymentRepository.delete(id);
  }
}

module.exports = new PaymentService();
