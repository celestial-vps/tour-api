const CustomerRepository = require('../repositories/customer.repository');

const CustomerService = {
  async getAll() {
    return await CustomerRepository.findAll();
  },

  async getById(id) {
    const customer = await CustomerRepository.findById(id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  },

  async create(payload, createdBy = null) {
    payload.createdBy = createdBy;
    return await CustomerRepository.create(payload);
  },

  async update(id, payload, modifiedBy = null) {
    payload.lastModifiedBy = modifiedBy;
    return await CustomerRepository.update(id, payload);
  },

  async delete(id, deletedBy = null) {
    return await CustomerRepository.softDelete(id, deletedBy);
  }
};

module.exports = CustomerService;
