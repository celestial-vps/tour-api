const User = require('./user');
const UserRole = require('./user-role');
const Bank = require('./bank');
const Country = require('./country');
const Province = require('./province');
const Conversation = require('./conversation');
const Message = require('./message');
const ConversationMember = require('./conversation-member');
const HotelRoom = require('./hotel-room');

const models = {
    User,
    UserRole,Country,Province,
    Bank,
    // Message,ConversationMember,Conversation,
    // HotelRoom
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