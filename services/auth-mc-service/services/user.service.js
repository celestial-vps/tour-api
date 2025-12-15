const userRepository = require('../repositories/user.repository');
const mappings = require('../mappings/user.vm');
const messageMaps = require('../mappings/message.vm');
const moment = require('moment');
const crypto = require('crypto');
require('dotenv').config();
const { hashPassword, checkPassword } = require('../misc/password');
const { JwtMaker } = require('../middleware/jwt');
const { v4: uuidv4 } = require('uuid');
const UserToken = require('../models/user-token');
const User = require('../models/user');
const OAuthUser = require('../models/oauthUser');

const jwtMaker = new JwtMaker();

// -------------------- UTIL --------------------
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex'); // 128 karakter
};

// -------------------- REGISTER USER --------------------
const register = async (dto, userOid) => {
  const now = moment().toISOString();
  const roleOidStr = process.env.RoleId || "";

  try {
    const hashedPassword = await hashPassword(dto.password);
    const data = {
      _id: uuidv4(),
      name: dto.name ?? "",
      email: dto.email,
      password: hashedPassword,
      roleOid: roleOidStr,
      createdBy: userOid ?? "",
      createdAt: now,
      lastModifiedBy: userOid ?? "",
      updatedAt: now
    };

    const { result, err } = await userRepository.save(data);
    if (err) return { user: null, err };

    const msgData = { value: result.id, name: data.email };
    const user = await messageMaps.toMessageResponse(msgData);
    return { user, err: null };

  } catch (err) {
    return { user: null, err: { httpStatus: 500, message: err.message } };
  }
};

// -------------------- LOGIN MANUAL --------------------
const login = async (condition, deviceType) => {
  try {
    const { users, err } = await userRepository.advanceFilter(condition);
    if (err) return { user: {}, err };
    if (!users || users.length === 0) return { user: {}, err: { message: "Data Not Found" } };

    const user = users[0];
    const isPasswordValid = await checkPassword(condition.password, user.password);
    if (!isPasswordValid) return { user: {}, err: { message: "Invalid Password" } };

    // Generate access token
    const accessToken = await jwtMaker.createToken(user._id, user.email);
    const accessExpiresAt = moment().add(30, 'minutes').toDate();

    // Generate secure refresh token
    const refreshToken = generateRefreshToken();
    const refreshExpiresAt = moment().add(30, 'days').toDate();

    await UserToken.create({
      userId: user._id,
      accessToken,
      refreshToken,
      deviceType: deviceType || 'web',
      expiresAt: accessExpiresAt,
      refreshExpiresAt
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      accessToken,
      refreshToken,
      accessExpiresAt,
      refreshExpiresAt
    };

    return { user: userResponse, err: null };

  } catch (err) {
    return { user: {}, err: { httpStatus: 500, message: err.message } };
  }
};

// -------------------- LOGIN VIA OAUTH2 --------------------
const loginWithOAuth2 = async ({ provider, providerId, email }, deviceType = 'web') => {
  try {
    let oauthUser = await OAuthUser.findOne({ provider, providerId }).populate('userId');
    let user;

    if (!oauthUser) {
      // Create new user if not exist
      const hashedPassword = await hashPassword(uuidv4()); // random password
      user = await User.create({
        _id: uuidv4(),
        email,
        password: hashedPassword,
        roleOid: process.env.RoleId || null,
        createdAt: moment().toISOString(),
        updatedAt: moment().toISOString()
      });

      oauthUser = await OAuthUser.create({
        userId: user._id,
        provider,
        providerId,
        accessToken: '',
        refreshToken: '',
        tokenExpiresAt: null
      });
    } else {
      user = oauthUser.userId;
    }

    // Generate tokens
    const accessToken = await jwtMaker.createToken(user._id, user.email);
    const accessExpiresAt = moment().add(30, 'minutes').toDate();
    const refreshToken = generateRefreshToken();
    const refreshExpiresAt = moment().add(30, 'days').toDate();

    await UserToken.create({
      userId: user._id,
      accessToken,
      refreshToken,
      deviceType,
      expiresAt: accessExpiresAt,
      refreshExpiresAt
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name || "",
      accessToken,
      refreshToken,
      accessExpiresAt,
      refreshExpiresAt
    };

    return { user: userResponse, err: null };

  } catch (err) {
    return { user: {}, err: { httpStatus: 500, message: err.message } };
  }
};

// -------------------- REFRESH TOKEN (ROTATING + SECURE) --------------------
const refreshAccessToken = async (refreshToken, deviceType = null) => {
  try {
    const query = { refreshToken, revoked: false, refreshExpiresAt: { $gt: new Date() } };
    if (deviceType) query.deviceType = deviceType;

    const tokenDoc = await UserToken.findOne(query).populate('userId');
    if (!tokenDoc) return { user: {}, err: { message: "Invalid or expired refresh token" } };

    const user = tokenDoc.userId;

    // Generate new access + refresh token
    const newAccessToken = await jwtMaker.createToken(user._id, user.email);
    const newAccessExpiresAt = moment().add(30, 'minutes').toDate();
    const newRefreshToken = generateRefreshToken();
    const newRefreshExpiresAt = moment().add(30, 'days').toDate();

    tokenDoc.accessToken = newAccessToken;
    tokenDoc.refreshToken = newRefreshToken;
    tokenDoc.expiresAt = newAccessExpiresAt;
    tokenDoc.refreshExpiresAt = newRefreshExpiresAt;
    await tokenDoc.save();

    return {
      user: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessExpiresAt: newAccessExpiresAt,
        refreshExpiresAt: newRefreshExpiresAt
      },
      err: null
    };

  } catch (err) {
    return { user: {}, err: { httpStatus: 500, message: err.message } };
  }
};

// -------------------- LOGOUT --------------------
const logout = async (refreshToken, deviceType = null) => {
  try {
    const query = { refreshToken, revoked: false };
    if (deviceType) query.deviceType = deviceType;

    const tokenDoc = await UserToken.findOne(query);
    if (!tokenDoc) return { success: false, err: { message: "Token not found" } };

    tokenDoc.revoked = true;
    await tokenDoc.save();

    return { success: true, err: null };
  } catch (err) {
    return { success: false, err: { httpStatus: 500, message: err.message } };
  }
};

module.exports = {
  register,
  login,
  loginWithOAuth2,
  refreshAccessToken,
  logout
};
