const joi = require('joi');
const jwt = require('jsonwebtoken');
const configEnv = require('../config.env');
const { validate, ApiError } = require('../helpers');
const UserModel = require('../database/models/UserModel');

module.exports = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization') || '';
  const token = authorizationHeader.replace('Bearer ', '');

  try {
    validate(joi.string().min(20).required(), token);
  } catch (err) {
    throw new ApiError(401, 'Unauthorized', {
      message: 'Not authorized',
    });
  }

  let userId;
  try {
    userId = await jwt.verify(token, configEnv.jwtPrivateKey).id;
  } catch (err) {
    throw new ApiError(401, 'Unauthorized', {
      message: 'Not authorized',
    });
  }

  let user = await UserModel.findOne({ token });
  if (!user) {
    throw new ApiError(401, 'Unauthorized', {
      message: 'Not authorized',
    });
  }

  user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(401, 'Unauthorized', {
      message: 'Not authorized',
    });
  }
  req.user = user;

  next();
};
