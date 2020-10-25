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

module.exports = router;
