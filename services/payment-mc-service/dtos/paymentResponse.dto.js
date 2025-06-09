class PaymentResponseDTO {
  constructor(payment) {
    this.id = payment.id;
    this.userId = payment.userId;
    this.amount = payment.amount;
    this.status = payment.status;
    this.method = payment.method;
    this.reference = payment.reference;
    this.createdAt = payment.createdAt;
    this.updatedAt = payment.updatedAt;
  }
}

module.exports = PaymentResponseDTO;
