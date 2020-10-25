const express = require('express');
const router = express.Router();

const { errorWrapper, multer } = require('../helpers');
const authCheck = require('../middlewares/auth-check');
const usersController = require('./usersController');

router.post('/auth/register', errorWrapper(usersController.createUser));

router.post('/auth/login', errorWrapper(usersController.loginUser));

router.post(
  '/auth/logout',
  errorWrapper(authCheck),
  errorWrapper(usersController.logoutUser),
);

router.get(
  '/auth/verify/:verificationToken',
  errorWrapper(usersController.verifyEmail),
);

router.get(
  '/current',
  errorWrapper(authCheck),
  errorWrapper(usersController.currentUser),
);

router.patch(
  '/',
  errorWrapper(authCheck),
  errorWrapper(usersController.updateSubscription),
);

router.patch(
  '/avatars',
  errorWrapper(authCheck),
  multer.single('avatar'),
  errorWrapper(usersController.updateUser),
);

module.exports = router;
