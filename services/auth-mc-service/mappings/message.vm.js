// Mapping functions
async function toMessageResponse(data) {
    const response = {
        value: data.value,
        name: data.name,
    };
    return response;
}

// Export everything
module.exports = {
    toMessageResponse
};