const User = require('./user');
const UserRole = require('./user-role');
const Country = require('./country');
const Province = require('./province');
const Conversation = require('./conversation');
const Message = require('./message');
const ConversationMember = require('./conversation-member');

const models = {
    User,
    UserRole,Country,Province,
    Message,ConversationMember,Conversation
    // Bank,
};

// Initialize associations
Object.values(models).forEach(model => {
    // @ts-ignore
    if (model.associate) {
        // @ts-ignore
        model.associate(models);
    }
});

module.exports = models;