// module.exports = userController;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;
const UserModel = require("../database/modules/user.model");
const { ApiError, errorHandler, mailer } = require("../helpers");
const userModel = require("../database/modules/user.model");

// const authRouter = Router();
class userController {
  constructor() {}
  async userRegister(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await UserModel.findOne({ email });

      if (user) throw new ApiError(409, "User with such email already exist");

      const passwordHash = await UserModel.hashPassword(password);
      const verificationToken = uuid();

      const { _id } = await UserModel.create({
        name,
        email,
        passwordHash,
        verificationToken,
      });

      await mailer.sendVerificationMail(email, verificationToken);

      res.status(201).send({ id: _id, name, email });
    } catch (err) {
      errorHandler(req, res, err);
    }
  }

  //==================================================================

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        throw new ApiError(401, "Email or password is wrong");
      }
      if (foundUser.verificationToken) {
        throw new ApiError(412, "Email not verified");
      }
      const isValid = await foundUser.isPasswordValid(password);
      if (!isValid) throw new ApiError(401, "Email or password is wrong");

      const token = await foundUser.generateAndSaveToken();

      const { _id, name, familyId } = foundUser;
      res.send({ user: { id: _id, username: name, email, familyId }, token });
    } catch (err) {
      errorHandler(req, res, err);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const foundUser = await UserModel.findOne({ verificationToken });

      if (!foundUser) throw new ApiError(404, "User is not found");

      foundUser.verificationToken = null;

      await foundUser.save();

      res.status(200).send("User is successfully verified");
    } catch (err) {
      errorHandler(req, res, err);
    }
  }

  validateUserObject(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        name: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4),
      }).validate(req.body);

      if (validationError) {
        throw new ApiError(400, "Bad request", validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async userLogout(req, res) {
    try {
      const { activeToken, user } = req;
  
      user.tokens = user.tokens.filter(
        (tokenRecord) => tokenRecord.token !== activeToken
      );
  
      await user.save();
  
      res.status(204).send();
    } catch (err) {
      errorHandler(req, res, err);
    }
  }
}

module.exports = new userController();
