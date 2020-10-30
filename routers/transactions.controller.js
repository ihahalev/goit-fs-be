const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { transactionModel, familyModel } = require('../database/models');
const { errorHandler, ApiError } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');

const {
  transactionCategories,
  transactionTypes,
} = require('../database/staticData');

class TransactionController {
  constructor() {}

  async createTransaction(req, res) {
    try {
      const { amount, type, category, comment } = req.body;
      const {
        _id,
        type: dbType,
        category: dbCategory,
        transactionDate,
      } = await transactionModel.create({
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

  async getAnnualStats(req, res) {
    try {
      const { familyId } = req.user;
      const { month, year } = req.params;
      const transes = await transactionModel.getFamilyAnnualReport(
        familyId,
        month,
        year,
      );
      return responseNormalizer(200, res, { transes });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async collect(req, res) {
    try {
      const [{ totalSavings }] = await transactionModel.monthlyAccrual(
        70000,
        95,
      );
      // const transes = await transactionModel.aggregate([
      //   {
      //     $addFields: {
      //       transactionDate: '$transactionDate',
      //       // day: { $dayOfMonth: '$transactionDate' },
      //       // hour: { $hour: '$transactionDate' },
      //       // amount: '$amount',
      //       year: { $year: '$transactionDate' },
      //       month: { $month: '$transactionDate' },
      //       incomeAmount: {
      //         $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
      //       },
      //       expenses: {
      //         $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
      //       },
      //       percentAmount: {
      //         $cond: [{ $eq: ['$type', 'PERCENT'] }, '$amount', 0],
      //       },
      //     },
      //   },
      //   {
      //     $match: {
      //       transactionDate: {
      //         $gte: new Date('2019-10-01'),
      //         $lt: new Date('2020-10-01'),
      //       },
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: {
      //         $dateToString: {
      //           format: '%Y-%m',
      //           date: '$transactionDate',
      //         },
      //       },
      //       incomeAmount: { $sum: '$incomeAmount' },
      //       expenses: { $sum: '$expenses' },
      //       percentAmount: { $sum: '$percentAmount' },
      //     },
      //   },
      //   {
      //     $addFields: {
      //       savings: { $subtract: ['$incomeAmount', '$expenses'] },
      //       expectedSavings: {
      //         $multiply: ['$incomeAmount', '$percentAmount', 0.01],
      //       },
      //       // year: {
      //       //   $dateFromString: {
      //       //     format: '%Y-%m',
      //       //     date: '$_id',
      //       //   },
      //       // },
      //       year: {
      //         $year: {
      //           date: {
      //             $dateFromString: { dateString: { $concat: ['$_id', '-01'] } },
      //           },
      //         },
      //       },
      //       month: {
      //         $month: {
      //           date: {
      //             $dateFromString: { dateString: { $concat: ['$_id', '-01'] } },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   { $sort: { _id: -1 } },
      // ]);
      return responseNormalizer(200, res, { totalSavings });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async familyAuthorization(req, res, next) {
    try {
      const { familyId } = req.user;
      if (!familyId) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }
      const family = familyModel.findById(user.familyId);
      if (!family) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }
      req.user = user;
      next();
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

  validateAnnualStatsParams(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        year: Joi.number().positive().integer().min(1970).required(),
        month: Joi.number().positive().integer().min(0).max(11).required(),
      }).validate(req.params);

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
