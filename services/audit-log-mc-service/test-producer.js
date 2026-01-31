const { Kafka } = require('kafkajs');

async function produceTestMessage() {
    const kafka = new Kafka({ clientId: 'test-producer', brokers: ['localhost:9092'] });
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
        topic: 'audit-logs',
        messages: [
            {
                value: JSON.stringify({
                    action: 'CREATE',
                    tableName: 'test_table',
                    message: 'This is a test audit log',
                    data: { test: 'value' },
                    timestamp: new Date().toISOString()
                })
            }
        ]
    });

    await producer.disconnect();
    console.log('Test message sent');
}

produceTestMessage();
