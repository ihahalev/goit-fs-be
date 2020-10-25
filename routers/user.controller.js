// module.exports = userController;
const Joi = require("joi");
const bcrypt = require("bcrypt");
const UserModel = require("../database/modules/user.model");
const {
  ApiError,
  errorHandler,
  validate,
  createVerificationToken,
  mailer,
} = require("../helpers");
const authorization = require("../middlewares/auth");

// const authRouter = Router();
class userController {
  constructor() {}
  async userRegister(req, res) {
    try {
      validate(
        Joi.object({
          name: Joi.string(),
          email: Joi.string().email().required(),
          password: Joi.string().min(4),
        }),
        req.body
      );

      const { name, email, password } = req.body;

      const [user] = await UserModel.find({ email });

      if (user) throw new ApiError(409, "Email are in use");

      console.log(typeof createVerificationToken);

      const verificationToken = createVerificationToken();

      await UserModel.create({
        name,
        email,
        passwordHash: password,
        verificationToken,
      });

      await mailer.sendMail(email, verificationToken);

      res.status(201).send({ name, email });
    } catch (err) {
      errorHandler(req, res, err);
    }
  }

  //==================================================================

  async userLogin(req, res) {
    try {
      validate(
        Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(4).required(),
        }),
        req.body
      );

      const { email, password } = req.body;

      const foundUser = await UserModel.findOne({ email });

      if (!foundUser) {
        throw new ApiError(401, "Email or password is wrong");
      }
      if (foundUser.verificationToken) {
        throw new ApiError(428, "Email not verified");
      }

      if (!foundUser.isPasswordValid(password))
        throw new ApiError(401, "Email or password is wrong");

      const token = await foundUser.generateAndSaveToken();

      const { _id, email: userEmail, familyId } = foundUser;
      res.send({ _id, userEmail, familyId, activeToken: token });
    } catch (err) {
      errorHandler(req, res, err);
    }
  }

  // authRouter.post("/logout", authorization, async (req, res) => {
  //   try {
  //     const { activeToken, user } = req;

  //     user.tokens = user.tokens.filter(
  //       (tokenRecord) => tokenRecord.token !== activeToken
  //     );

  //     await user.save();

  //     res.status(204).send();
  //   } catch (err) {
  //     errorHandler(req, res, err);
  //   }
  // });

  async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const foundUser = await UserModel.findOne({ verificationToken });

      if (!foundUser) throw new ApiError(404, "User is not found");

      foundUser.verificationToken = null;

      await foundUser.save();
      console.log("foundUser", foundUser);

      res.status(200).send("User is successfully verified");
    } catch (err) {
      errorHandler(req, res, err);
    }
  }
}

module.exports = new userController();
