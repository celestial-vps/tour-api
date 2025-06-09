async function toMessageResponse(message) {
    const response = {
        oid: message.oid,
        value: message.value,
        name: message.name,
        createdBy: message.createdBy,
        updatedAt: message.updatedAt
    };
    return response;
}

async function toMessageResponses(messages) {
    const messageResponses = await Promise.all(messages.map(toMessageResponse));
    return messageResponses;
}

// Export everything
module.exports = {
    toMessageResponse,
    toMessageResponses
};