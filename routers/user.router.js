const express = require('express');
const userController = require('./user.controller');
const authorization = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.post(
  '/sign-up',
  userController.validateUserObject,
  userController.userRegister,
);

userRouter.post(
  '/sign-in',
  userController.validateUserObject,
  userController.userLogin,
);

userRouter.get(
  '/sign-out/:name',
  // authorization,
  userController.userLogout,
)


userRouter.get('/verify/:verificationToken', userController.verifyEmail);

module.exports = userRouter;
