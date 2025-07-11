const toMessageResponse = async (message) => {
  return {
    oid: message.value ?? message.oid,
    message: message.name ?? message.message,
  };
};

const toMessageResponses = async (messages) => {
  return messages.map((msg) => ({
    oid: msg.oid,
    message: msg.message,
  }));
};

module.exports = {
  toMessageResponse,
  toMessageResponses,
};
