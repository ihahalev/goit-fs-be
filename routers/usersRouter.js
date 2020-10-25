const express = require("express");
const userController = require("./user.controller");
const authorization = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post(
  "/sign-up",
  userController.userRegister
);

userRouter.post(
  "/sign-in",
  userController.userLogin
);

userRouter.get(
  "/verify/:verificationToken",
  userController.verifyEmail
);

module.exports = userRouter;
