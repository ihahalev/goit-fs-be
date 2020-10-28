const express = require('express');
const router = express.Router();
const transactionsController = require('./transactions.controller');
const authCheck = require('../middlewares/auth');

router.post('/', authCheck, transactionsController.validateTransactionObject, transactionsController.createTransaction);

router.get('/categories', authCheck, transactionsController.getCategories);

module.exports = router;
