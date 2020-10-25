const express = require('express');
const router = express.Router();
const errorWrapper = require('../helpers/error-wrapper');
const transactionsController = require('./transactionsController');
const authCheck = require('../middlewares/auth-check');

router.post(
  '/',
  errorWrapper(authCheck),
  transactionsController.createTransaction,
);

router.get(
  '/categories',
  errorWrapper(authCheck),
  transactionsController.getCategories,
);

// router.get(
//   '/collect',

//   transactionsController.collect,
// );

module.exports = router;
