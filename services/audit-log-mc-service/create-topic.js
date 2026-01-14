import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "audit-trail-microservice",
  brokers: ["kafka-dev:9092"],
});

const admin = kafka.admin();

async function createTopic() {
  await admin.connect();
  const topics = await admin.listTopics();

  if (!topics.includes("audit-logs")) {
    console.log("Membuat topic 'audit-logs'...");
    await admin.createTopics({
      topics: [
        {
          topic: "audit-logs",
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
    console.log("Topic 'audit-logs' berhasil dibuat!");
  } else {
    console.log("Topic 'audit-logs' sudah ada, tidak perlu dibuat.");
  }

  await admin.disconnect();
}

createTopic().catch((err) => {
  console.error("Gagal membuat topic:", err);
  process.exit(1);
});
