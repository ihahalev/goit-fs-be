const express = require('express');
const router = express.Router();
const transactionsController = require('./transactions.controller');
const authCheck = require('../middlewares/auth');

router.post(
  '/',
  authCheck,
  transactionsController.familyAuthorization,
  transactionsController.validateTransactionObject,
  transactionsController.createTransaction,
);

router.get('/categories', authCheck, transactionsController.getCategories);

router.get(
  '/stats/annual',
  authCheck,
  transactionsController.familyAuthorization,
  transactionsController.validateAnnualStatsParams,
  transactionsController.getAnnualStats,
);

router.get(
  '/collect',

  transactionsController.collect,
);

module.exports = router;
