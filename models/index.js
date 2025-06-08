const User = require('./user');
const UserRole = require('./user-role');
const Country = require('./country');
const Province = require('./province');

const models = {
    User,
    UserRole,Country,Province
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