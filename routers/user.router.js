const express = require("express");
const authorization = require("../middlewares/auth");
const getCurrentUser = require("./user.controller");
const userRouter = express.Router();

userRouter.post(
  "/sign-up",
  getCurrentUser.validateUserObject,
  getCurrentUser.userRegister
);

userRouter.post(
  "/sign-in",
  getCurrentUser.validateUserObject,
  getCurrentUser.userLogin
);

userRouter.delete("/sign-out", authorization, getCurrentUser.logout);

userRouter.get("/current", authorization, getCurrentUser.userCurrent);

userRouter.get("/verify/:verificationToken", getCurrentUser.verifyEmail);

module.exports = userRouter;
