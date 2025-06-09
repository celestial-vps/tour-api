class CreatePaymentDTO {
  constructor({ userId, amount, method, reference, metadata }) {
    this.userId = userId;
    this.amount = parseFloat(amount);
    this.method = method;
    this.reference = reference || null;
    this.metadata = metadata || {};
  }

  static validate(data) {
    if (!data.userId) throw new Error('userId is required');
    if (!data.amount || isNaN(data.amount)) throw new Error('Valid amount is required');
    if (!data.method) throw new Error('Payment method is required');

    return new CreatePaymentDTO(data);
  }
}

module.exports = CreatePaymentDTO;
