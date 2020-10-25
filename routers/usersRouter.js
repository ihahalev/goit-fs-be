const express = require("express");
const userController = require("./user.controller");

const userRouter = express.Router();

userRouter.post(
  "/sign-up",
  // userController.validateUserObject,
  userController.userRegister
);

userRouter.post(
  "/sign-in",
  // userController.validateUserObject,
  userController.userLogin
);

userRouter.get(
  "/auth/verify/:verificationToken",
  userController.verifyEmail
);

module.exports = userRouter;
