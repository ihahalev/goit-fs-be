const Joi = require('joi');
const path = require('path');
const uuid = require('uuid').v4;

const {
  validate,
  ApiError,
  avaGenerate,
  minifyImg,
  mailer,
} = require('../helpers');

const UserModel = require('../database/models/UserModel');
const configEnv = require('../config.env');

class UserController {
  constructor() {
    this.validUserObject = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(3).required(),
    });
    this.validSubscription = Joi.object({
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    });
    this.validUserUpdate = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(3),
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    });
  }
  get createUser() {
    return this._createUser.bind(this);
  }
  get loginUser() {
    return this._loginUser.bind(this);
  }
  get updateSubscription() {
    return this._updateSubscription.bind(this);
  }
  get updateUser() {
    return this._updateUser.bind(this);
  }

  async _createUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;
    const isUserExist = await UserModel.findOne({ email });
    if (isUserExist) {
      throw new ApiError(409, 'Conflict', {
        message: 'Email in use',
      });
    }

    const { firstAva, avaDest } = await avaGenerate(email);
    const passwordHash = await UserModel.hashPasssword(password);
    const verificationToken = uuid();
    const userAdded = await UserModel.create({
      email,
      password: passwordHash,
      avatarURL: `${configEnv.imgUrl}${firstAva}`,
      avatarPath: avaDest,
      verificationToken,
    });
    const userRes = {
      email: userAdded.email,
      subscription: userAdded.subscription,
      avatarURL: userAdded.avatarURL,
    };

    await this.sendVerificationEmail(email, verificationToken);

    return res.status(201).send(userRes);
  }

  async _loginUser(req, res) {
    validate(this.validUserObject, req.body);
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }

    if (user.verificationToken) {
      throw new ApiError(428, 'Precondition Required', {
        message: 'Email not verified',
      });
    }

    const isValid = user.isPasswordValid(password);
    if (!isValid) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Email or password is wrong',
      });
    }
    const token = await user.generateAndSaveToken();
    res.status(200).send({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  }

  async logoutUser(req, res) {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }
    await user.deleteToken(_id);
    return res.status(204).send();
  }

  async currentUser(req, res) {
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }

    const userRes = {
      email: user.email,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
    };
    return res.status(200).send(userRes);
  }

  async _updateSubscription(req, res) {
    validate(this.validSubscription, req.body);
    const { subscription } = req.body;
    const { _id } = req.user;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new ApiError(401, 'Unauthorized', {
        message: 'Not authorized',
      });
    }
    await user.updateSub(subscription);
    res.status(205).send({
      email: user.email,
      subscription,
      avatarURL: user.avatarURL,
    });
  }

  async _updateUser(req, res) {
    const updateFields = {};
    if (req.file && req.file.path && req.file.filename) {
      const { filename } = req.file;
      await minifyImg(req.file.path, filename);
      updateFields.avatarURL = `${configEnv.imgUrl}${filename}`;
      updateFields.avatarPath = path.join(configEnv.paths.avatars, filename);
    }

    validate(this.validUserUpdate, req.body);
    const { email, password, subscription } = req.body;

    if (email) {
      updateFields.email = email;
    }
    if (subscription) {
      updateFields.subscription = subscription;
    }
    if (password) {
      const passwordHash = await UserModel.hashPasssword(password);
      updateFields.password = passwordHash;
    }

    const { _id } = req.user;
    const user = await UserModel.findById(_id);

    await user.updateUser(updateFields);
    res.status(200).send(updateFields);
  }

  async sendVerificationEmail(email, verificationToken) {
    const msg = {
      to: email,
      subject: 'Email verification',
      html: `<a href='${configEnv.srvUrl}/api/users/auth/verify/${verificationToken}'>Click here</a>`,
    };
    await mailer.sendHtml(msg);
  }

  async verifyEmail(req, res, next) {
    const { verificationToken } = req.params;

    const userToVerify = await UserModel.findByVerificationToken(
      verificationToken,
    );
    if (!userToVerify) {
      throw new ApiError(404, 'Not Found', {
        message: 'User not found',
      });
    }

    await UserModel.verifyUserEmail(userToVerify._id);

    return res.status(200).send('User successfully verified');
  }
}

module.exports = new UserController();
