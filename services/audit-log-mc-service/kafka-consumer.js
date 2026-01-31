const fs = require('fs').promises;
const { Kafka } = require('kafkajs');
const axios = require('axios');

// const kafka = new Kafka({
//   clientId: 'audit-trail-microservice',
//   brokers: ['192.168.0.197:9092'],
// });
const KAFKA_BROKERS = process.env.KAFKA_BROKERS.split(',');
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP;
const KAFKA_TOPIC = process.env.KAFKA_TOPIC;
const AUDIT_API_URL = process.env.AUDIT_API_URL;

console.log('🔥 KAFKA BROKERS:', KAFKA_BROKERS);
console.log('🔥 AUDIT API URL:', AUDIT_API_URL);
const kafka = new Kafka({ clientId: KAFKA_CLIENT_ID, brokers: KAFKA_BROKERS });
const consumer = kafka.consumer({
  groupId: KAFKA_CONSUMER_GROUP,
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  maxPollInterval: 300000,
  allowAutoTopicCreation: false,
});


// const kafka = new Kafka({
//   clientId: 'audit-trail-microservice',
//   brokers: KAFKA_BROKERS,
// });

// const consumer = kafka.consumer({
//   groupId: process.env.KAFKA_CONSUMER_GROUP || 'audit-trail-group',
//   sessionTimeout: 30000,
//   heartbeatInterval: 3000,
//   maxPollInterval: 300000,
//   allowAutoTopicCreation: false,
// });

function isValidData(message) {
  if (!message.recordOid || message.recordOid === 'unknown') return false;
  return true;
}

async function sendToAuditAPI(data, attempt = 1) {
  const maxAttempts = 5;
  try {
    // const response = await axios.post('http://192.168.0.197:3001/api/v1/audit-log/create', data);
    const response = await axios.post(AUDIT_API_URL + '/create', data);
    if (response.status === 201) {
      console.log('✅ Sukses kirim ke audit API:', response.status);
      return true;
    } else {
      throw new Error(`Status code: ${response.status}`);
    }
  } catch (error) {
    console.warn(`⚠️ Gagal attempt ${attempt}: ${error.message}`);
    if (attempt < maxAttempts) {
      await new Promise(r => setTimeout(r, 1000 * attempt));
      return sendToAuditAPI(data, attempt + 1);
    } else {
      console.error('❌ Semua attempt gagal. Simpan ke file.');
      await saveFailedDataToFile(data);
      return false;
    }
  }
}

async function saveFailedDataToFile(data) {
  const logFile = 'failed-audit-data.log';
  try {
    await fs.appendFile(logFile, JSON.stringify(data) + '\n');
  } catch (err) {
    console.error('Gagal simpan data gagal ke file:', err);
  }
}

async function runConsumer() {
  while (true) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

      // await consumer.subscribe({ topic: 'audit-logs', fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ message }) => {
          const value = message.value.toString();
          let data;
          try {
            data = JSON.parse(value);
          } catch (err) {
            console.error('Invalid JSON message:', err);
            return;
          }

          if (!isValidData(data)) {
            console.warn('Invalid data, skip processing:', data);
            return;
          }

          await sendToAuditAPI(data);
        },
      });

      break; // keluar loop kalau berhasil connect dan run
    } catch (error) {
      console.error('Consumer error:', error);
      console.log('Mencoba reconnect dalam 5 detik...');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function retryFailedData() {
  const logFile = 'failed-audit-data.log';

  try {
    const content = await fs.readFile(logFile, 'utf-8');
    if (!content.trim()) {
      console.log('No failed data to retry');
      return;
    }

    let lines = content.trim().split('\n');
    const remainingLines = [];

    for (const line of lines) {
      const data = JSON.parse(line);
      try {
        // await axios.post('http://192.168.0.197:3001/api/v1/audit-log/create', data);
        await axios.post(AUDIT_API_URL + '/create', data);
        console.log('Retry success:', data);
      } catch (err) {
        console.error('Retry failed:', err.message);
        remainingLines.push(line);
      }
    }

    await fs.writeFile(logFile, remainingLines.join('\n') + (remainingLines.length ? '\n' : ''), 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No failed data log file found');
    } else {
      console.error('Error reading failed data log:', err);
    }
  }
}

// Jalankan semuanya secara berurutan
(async () => {
  await retryFailedData();
  await runConsumer();
})();
