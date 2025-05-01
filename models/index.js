const User = require('./user');
const UserRole = require('./user-role');
const Bank = require('./Bank');

const models = {
    User,
    UserRole,
    // Bank,
};

// Initialize associations
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

module.exports = models;