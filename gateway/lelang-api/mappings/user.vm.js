const moment = require('moment');

// Mapping functions
async function toUserResponse(user) {
  const response = {
    oid: user._id,
    name: user.name,
    email: user.email,
    androidToken: user.androidToken,
    expiredTime: user.expiredTime,
    isActive: user.isActive,
    activatedAt: moment(user.activatedAt).format(),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return response;
}

async function toUserRegisterResponse(user) {
  const response = {
    oid: user._id,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return response;
}

async function toUserTokenResponse(user, token, refreshToken) {
  const response = {
    oid: user._id,
    email: user.email,
    token,
    refreshToken,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return response;
}

async function toUserResponses(users) {
  const userResponses = await Promise.all(users.map(toUserResponse));
  return userResponses;
}

// Export everything
module.exports = {    
  toUserResponse,
  toUserRegisterResponse,
  toUserTokenResponse,
  toUserResponses
};