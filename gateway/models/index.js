const User = require('./user');
const UserRole = require('./user-role');
const Bank = require('./bank');
const Country = require('./country');
const Province = require('./province');
const Conversation = require('./conversation');
const Message = require('./message');
const ConversationMember = require('./conversation-member');
const HotelRoom = require('./hotel-room');
const Subdistrict = require('./sub-district');
const City = require('./city');
const District = require('./district');
const SubArea = require('./sub-area');
const Vehicle = require('./vehicle');
const VehicleType = require('./vehicle-type');

const models = {
    User,
    UserRole, Country, Province, City, District, Subdistrict,
    Bank,
    SubArea,Vehicle,VehicleType

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