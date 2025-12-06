const moment = require('moment');

// Mapping functions
async function toUserResponse(user) {
  const response = {
    oid: user.oid,
    name: user.name,
    email: user.email,
    // password: user.password,
    roleOid: user.roleOid,
    androidToken: user.androidToken,
    expiredTime: user.expiredTime,
    isActive: user.isActive ? true : false,
    activatedAt: user.activatedAt ? moment(user.activatedAt).format('YYYY-MM-DD') : null,
    userRole: user.userRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return response;
}

async function toUserRegisterResponse(user) {
  const response = {
    oid: user.oid,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  return response;
}

async function toUserTokenResponse(user, token, refreshToken) {
  const response = {
    oid: user.oid,
    email: user.email,
    token,
    refreshToken,
    userRole: user.userRole,
    roleOid: user.roleOid,
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
