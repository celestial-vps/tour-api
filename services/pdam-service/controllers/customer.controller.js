const CustomerService = require('../services/customer.service');

const CustomerController = {
  async getAll(req, res) {
    try {
      const customers = await CustomerService.getAll();
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const customer = await CustomerService.getById(req.params.id);
      res.json(customer);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const createdBy = req.user?.id || null; // Anda bisa ganti dengan data autentikasi
      const customer = await CustomerService.create(req.body, createdBy);
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const modifiedBy = req.user?.id || null;
      const customer = await CustomerService.update(req.params.id, req.body, modifiedBy);
      res.json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const deletedBy = req.user?.id || null;
      await CustomerService.delete(req.params.id, deletedBy);
      res.json({ message: 'Customer deleted (soft delete)' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = CustomerController;
