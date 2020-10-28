const express = require("express");
const userController = require("./user.controller");
const authorization = require("../middlewares/auth");
const { userCurrent } = require("./user.controller");
const userRouter = express.Router();

userRouter.post(
  "/sign-up",
  userController.validateUserObject,
  userController.userRegister
);

userRouter.post(
  "/sign-in",
  userController.validateUserObject,
  userController.userLogin
);

userRouter.delete("/sign-out", authorization, userController.userLogout);

userRouter.get("/current", authorization, userController.userCurrent);

userRouter.get("/verify/:verificationToken", userController.verifyEmail);

module.exports = userRouter;
