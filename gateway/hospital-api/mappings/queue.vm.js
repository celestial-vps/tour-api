async function toQueueResponse(queue) {
    return {
        oid: queue.oid,
        patientOid: queue.patientOid,
        roomOid: queue.roomOid,
        doctorOid: queue.doctorOid,
        status: queue.status,
        scheduledAt: queue.scheduledAt,
        createdAt: queue.createdAt,
        updatedAt: queue.updatedAt
    };
}

async function toQueueResponses(queues) {
    return await Promise.all(queues.map(toQueueResponse));
}

module.exports = {
    toQueueResponse,
    toQueueResponses
};
