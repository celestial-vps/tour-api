const toConversationResponse = async (conversation) => {
  return {
    oid: conversation.value ?? conversation.oid,
    name: conversation.name,
    isGroup: conversation.isGroup,
    deletedBy: conversation.deletedBy ?? null,
    deletedAt: conversation.deletedAt ?? null,
  };
};

const toConversationResponses = async (conversations) => {
  return conversations.map((conv) => ({
    oid: conv.oid,
    name: conv.name,
    isGroup: conv.isGroup,
    deletedBy: conv.deletedBy,
    deletedAt: conv.deletedAt,
  }));
};

module.exports = {
  toConversationResponse,
  toConversationResponses,
};
