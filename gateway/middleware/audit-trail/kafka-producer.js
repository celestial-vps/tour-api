// middleware/audit-trail/kafka-producer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'monolith-app',
  brokers: ['localhost:9092'], // Ganti dengan alamat broker Kafka kamu
});

const producer = kafka.producer();

async function sendAuditLog(auditData) {
  try {
    await producer.connect();
    await producer.send({
      topic: 'audit-logs',               // Nama topic Kafka
      messages: [{ value: JSON.stringify(auditData) }],
    });
    console.log(`✅ Audit log sent: ${auditData.action} ${auditData.tableName}`);
  } catch (error) {
    console.error('❌ Failed to send audit log:', error);
    // Optional: fallback simpan ke file atau queue lokal
  } finally {
    await producer.disconnect();
  }
}

module.exports = sendAuditLog;
