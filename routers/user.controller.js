const userModel = require("../database/modules/user/user.model");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const config = require("../config.env");

class userController {
  static userRegister = async (req, res, next) => {
    try {
      const existUser = await userModel.findOne({ email: req.body.email });

      if (existUser) {
        return res.status(409).send({ message: "Email in use" });
      }

      const verificationToken = uuidv4();

      await this.sendVerificationEmail(req.body.email, verificationToken);

      const userToAdd = {
        username: req.body.name,
        email: req.body.email,
        passwordHash: req.body.password,
        verificationToken,
      };

      const user = await userModel.create(userToAdd);
      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  };

  static sendVerificationEmail = async (email, verificationToken) => {
    await sgMail.setApiKey(config.mail.SGKey);

    const msg = {
      to: email,
      from: config.email,
      subject: "Verification",
      text: `http://localhost:${config.port}/verify/${verificationToken}`,
      html: `<p>Please, <a href=http://localhost:${config.port}/auth/verify/${verificationToken}>click</a> to verify your email</p>`,
    };

    sgMail.send(msg);
  };

  static validateUserObject = async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().required(),
        password: Joi.string(),
      });

      const validateUser = schema.validate(req.body);

      if (validateUser.error) {
        return res.status(400).send(validateUser.error.details[0].message);
      }

      next();
    } catch (err) {
      next(err);
    }
  };

  static userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(401).send({ message: "Email or password is wrong" });
      }
      console.log("password", password);
      console.log("user.passwordHash", user.passwordHash);

      const isPassValid = await bcrypt.compare(password, user.passwordHash);

      if (isPassValid) {
        return res.status(402).send({ message: "Email or password is wrong" });
      }

      const token = await user.generateAndSaveToken();

      await userModel.findByIdAndUpdate(user._id, {
        token,
      });

      res.status(200).send({
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
        },
        activeToken: token,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = userController;
