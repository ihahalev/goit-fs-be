const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const TransactionModel = require('../database/models/TransactionModel');
const UserModel = require('../database/models/UserModel');
// const FamilyModel = require('../database/models/FamilyModel');
const { errorHandler, validate, ApiError } = require('../helpers');

const {
  transactionCategories,
  transactionTypes,
} = require('../database/staticData');

class TransactionController {
  constructor() {
    this.validTransactionObject = Joi.object({
      amount: Joi.number().positive().integer().required(),
      type: Joi.string().valid(...transactionTypes),
      category: Joi.string().min(3),
      comment: Joi.string().min(3),
    });
  }

  get createTransaction() {
    return this._createTransaction.bind(this);
  }

  async _createTransaction(req, res) {
    try {
      const user = await UserModel.findById(req.user);
      if (!user.familyId) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }
      // const family = FamilyModel.findById(user.familyId);
      // if (!family) {
      //   throw new ApiError(403, 'Forbidden', {
      //     message: 'Not part of a Family',
      //   });
      // }

      validate(this.validTransactionObject, req.body);
      const { amount, type, category, comment } = req.body;
      const {
        _id,
        type: dbType,
        category: dbCategory,
        transactionDate,
      } = await TransactionModel.create({
        amount,
        type,
        category,
        comment,
        // familyId: req.family,
        userId: req.user,
        transactionDate: Date.now(),
      });
      return res.status(201).send({
        _id,
        amount,
        type: dbType,
        category: dbCategory,
        comment,
        transactionDate,
      });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async getCategories(req, res) {
    try {
      return res.status(200).send({ transactionCategories });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }
}

module.exports = new TransactionController();
