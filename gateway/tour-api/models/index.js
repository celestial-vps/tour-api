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
const TravelRoute = require('./travel-route');
const TravelSchedule = require('./travel-schedule');
const Driver = require('./driver');
const sequelize = require('../config/database');


const models = {
    sequelize,
    User,
    UserRole, Country, Province, City, District, Subdistrict,
    Bank,
    SubArea, Vehicle, VehicleType, TravelRoute,
    Driver,
    TravelSchedule, 


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