const toConversationMemberResponse = async (conversationMember) => {
  return {
    conversationOid: conversationMember.conversationOid,
    userOid: conversationMember.userOid,
  };
};

const toConversationMemberResponses = async (conversationMembers) => {
  return conversationMembers.map((cm) => ({
    conversationOid: cm.conversationOid,
    userOid: cm.userOid,
  }));
};

module.exports = {
  toConversationMemberResponse,
  toConversationMemberResponses,
};
