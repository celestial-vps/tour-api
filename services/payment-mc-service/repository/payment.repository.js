// src/repositories/payment.repository.js
const { Payment } = require('../models');

class PaymentRepository {
    async create(data) {
        return await Payment.create(data);
    }

    async findAll() {
        return await Payment.findAll();
    }

    async findById(id) {
        return await Payment.findByPk(id);
    }

    async update(id, data) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;

        await payment.update(data);
        return payment;
    }

    async delete(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) return null;

        await payment.destroy();
        return true;
    }
}

module.exports = new PaymentRepository();
