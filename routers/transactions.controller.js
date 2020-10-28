const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const TransactionModel = require('../database/models/transaction.model');
const UserModel = require('../database/models/user.model');
// const FamilyModel = require('../database/models/FamilyModel');
const { errorHandler, ApiError } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');

const { transactionCategories, transactionTypes } = require('../database/staticData');

class TransactionController {
  constructor() {}

  async createTransaction(req, res) {
    try {
      const user = await UserModel.findById(req.user);
      if (!user.familyId) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }
      const family = FamilyModel.findById(user.familyId);
      if (!family) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }

      const { amount, type, category, comment } = req.body;
      const { _id, type: dbType, category: dbCategory, transactionDate } = await TransactionModel.create({
        amount,
        type,
        category,
        comment,
        familyId: req.family,
        userId: req.user,
        transactionDate: Date.now(),
      });
      return responseNormalizer(201, res, {
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
      return responseNormalizer(200, res, { transactionCategories });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  validateTransactionObject(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        amount: Joi.number().positive().integer().required(),
        type: Joi.string().valid(...transactionTypes),
        category: Joi.string().min(3),
        comment: Joi.string().min(3),
      }).validate(req.body);

      if (validationError) {
        throw new ApiError(400, 'Bad requiest', validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }
}

module.exports = new TransactionController();
