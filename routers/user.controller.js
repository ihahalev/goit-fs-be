// const userModel = require("../database/modules/user.model");
// const bcrypt = require("bcrypt");
// const Joi = require("@hapi/joi");
// const { v4: uuidv4 } = require("uuid");
// const sgMail = require("@sendgrid/mail");
// const config = require("../config.env");

// class userController {
//   static userRegister = async (req, res, next) => {
//     try {
//       const existUser = await userModel.findOne({ email: req.body.email });

//       if (existUser) {
//         return res.status(409).send({ message: "Email in use" });
//       }

//       const verificationToken = uuidv4();

//       await this.sendVerificationEmail(req.body.email, verificationToken);

//       const userToAdd = {
//         username: req.body.name,
//         email: req.body.email,
//         passwordHash: req.body.password,
//         verificationToken,
//       };

//       const user = await userModel.create(userToAdd);
//       res.status(201).json({
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       });
//     } catch (err) {
//       next(err);
//     }
//   };

//   static sendVerificationEmail = async (email, verificationToken) => {
//     try {
//       await sgMail.setApiKey(config.mail.SGKey);

//       const msg = {
//         to: email,
//         from: config.email,
//         subject: "Verification",
//         text: `http://localhost:${config.port}/verify/${verificationToken}`,
//         html: `<p>Please, <a href=http://localhost:${config.port}/auth/verify/${verificationToken}>click</a> to verify your email</p>`,
//       };

//       sgMail.send(msg);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   static validateUserObject = async (req, res, next) => {
//     try {
//       const schema = Joi.object({
//         name: Joi.string(),
//         email: Joi.string().required(),
//         password: Joi.string(),
//       });

//       const validateUser = schema.validate(req.body);

//       if (validateUser.error) {
//         return res.status(400).send(validateUser.error.details[0].message);
//       }

//       next();
//     } catch (err) {
//       next(err);
//     }
//   };

//   static userLogin = async (req, res, next) => {
//     try {
//       const { email, password } = req.body;

//       const user = await userModel.findOne({ email });

//       if (!user) {
//         return res.status(401).send({ message: "Email or password is wrong" });
//       }

//       console.log("password", password);
//       console.log("user.passwordHash", user.passwordHash);

//       const isPassValid = await bcrypt.compare(password, user.passwordHash);

//       if (isPassValid) {
//         return res.status(402).send({ message: "Email or password is wrong" });
//       }

//       const token = await user.generateAndSaveToken();

//       await userModel.findByIdAndUpdate(user._id, {
//         token,
//       });

//       res.status(200).send({
//         user: {
//           id: user._id,
//           name: user.username,
//           email: user.email,
//           familyId: user.familyId
//         },
//         activeToken: token,
//       });
//     } catch (err) {
//       next(err);
//     }
//   };
// }

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

      const { name, email, passwordHash } = req.body;

      const [user] = await UserModel.find({ email });

      if (user) throw new ApiError(409, "Email are in use");

      console.log(typeof createVerificationToken);

      const verificationToken = createVerificationToken();

      await UserModel.create({
        name,
        email,
        passwordHash,
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

      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.passwordHash
      );

      if (!isPasswordValid)
        throw new ApiError(401, "Email or password is wrong");

      const token = await foundUser.generateAndSaveToken();

      const { _id, email: userEmail } = foundUser;
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
