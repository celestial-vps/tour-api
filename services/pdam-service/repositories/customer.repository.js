const Customer = require('../models/Customer');

const CustomerRepository = {
  async findAll() {
    return Customer.find({ deletedAt: null });
  },

  async findById(id) {
    return Customer.findOne({ _id: id, deletedAt: null });
  },

  async create(data) {
    return Customer.create(data);
  },

  async update(id, data) {
    return Customer.findByIdAndUpdate(id, data, { new: true });
  },

  async softDelete(id, deletedBy) {
    return Customer.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      deletedBy
    });
  }
};

module.exports = CustomerRepository;
