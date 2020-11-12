const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {
  Types: { ObjectId },
} = mongoose;

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
      const { _id: userId, familyId } = req.user;
      const { amount, type, category, comment } = req.body;
      const defCategory = category ? category : transactionCategories[0];
      const {
        _id,
        type: dbType,
        category: dbCategory,
        transactionDate,
      } = await transactionModel.create({
        amount,
        type,
        category: defCategory,
        comment,
        familyId,
        userId: userId,
        transactionDate: Date.now(),
      });
      const monthBalance = await transactionModel.getFamilyMonthBalance(
        familyId,
      );
      return responseNormalizer(201, res, {
        _id,
        amount,
        type: dbType,
        category: dbCategory,
        comment,
        transactionDate,
        monthBalance,
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
      const { month, year } = req.query;
      const transes = await transactionModel.getFamilyAnnualReport(
        familyId,
        Number(month),
        Number(year),
      );
      return responseNormalizer(200, res, { transes });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async getCurrentMonth(req, res) {
    try {
      const { familyId } = req.user;
      const monthBalance = await transactionModel.getFamilyMonthBalance(
        familyId,
      );
      return responseNormalizer(200, res, { monthBalance });
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
      const family = familyModel.findById(familyId);
      if (!family) {
        throw new ApiError(403, 'Forbidden', {
          message: 'Not part of a Family',
        });
      }
      req.family = family;
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
        category: Joi.alternatives().try(
          Joi.string().valid(...transactionCategories),
          Joi.string().empty('').default(transactionCategories[0]),
        ),
        comment: Joi.string().allow(''),
      }).validate(req.body);

      if (validationError) {
        throw new ApiError(400, 'Bad request', validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  validateAnnualStatsQuery(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        year: Joi.number().positive().integer().min(1970).required(),
        month: Joi.number().positive().integer().min(1).max(12).required(),
      }).validate(req.query);

      if (validationError) {
        throw new ApiError(400, 'Bad request', validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  async collect(req, res, next) {
    try {
      // const excess = await transactionModel.find({
      // transactionDate: { $gte: new Date('2020-10-29') },
      // type: { $in: ['INCOME', 'PERCENT'] },
      // });
      // await Promise.all(
      //   excess.map(async (item) => {
      //     await transactionModel.findByIdAndDelete(item._id);
      //   }),
      // );
      // const allTranses = await transactionModel.find({});
      // const excess = await Promise.all(
      //   allTranses.map(async (item) => {
      //     if (!item.userId) {
      //       transactionModel.findByIdAndDelete(item._id);
      //       return;
      //     }
      //     const user = await userModel.findById(item.userId);
      //     if (!user) {
      //       transactionModel.findByIdAndDelete(item._id);
      //       return;
      //     }
      //     if (!user.familyId) {
      //       transactionModel.findByIdAndDelete(item._id);
      //       return;
      //     }
      //     return transactionModel.findByIdAndUpdate(item._id, {
      //       familyId: user.familyId,
      //     });
      //   }),
      // );
      // const transes = await transactionModel.aggregate([
      // {
      //   $match: {
      //     familyId: familyId,
      //   },
      // },
      // {
      //   $match: {
      //     transactionDate: {
      //       $gte: new Date('2019-09-01'),
      //       $lt: new Date('2020-10-01'),
      //     },
      //   },
      // },
      // {
      //   $addFields: {
      // transactionDate: '$transactionDate',
      // incomeAmount: {
      //   $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
      // },
      // expenses: {
      //   $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
      // },
      //     percentAmount: {
      //       $cond: [{ $eq: ['$type', 'PERCENT'] }, '$amount', null],
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: {
      //       $dateToString: {
      //         format: '%Y-%m',
      //         date: '$transactionDate',
      //       },
      //     },
      //     incomeAmount: { $sum: '$incomeAmount' },
      //     expenses: { $sum: '$expenses' },
      //     percentAmount: { $addToSet: '$percentAmount' },
      //     comment: { $addToSet: '$comment' },
      //   },
      // },
      // {
      //   $addFields: {
      // savings: { $subtract: ['$incomeAmount', '$expenses'] },
      // expectedSavings: {
      //   $multiply: ['$incomeAmount', '$percentAmount', 0.01],
      // },
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
      const transes = await transactionModel.find({
        // transactionDate: {
        //   // $gte: new Date('2019-09-01'),
        //   $lt: new Date('2020-11-01'),
        // },
        userId: ObjectId('5fad99c3b22305000424a62b'),
        type: 'EXPENSE',
      });
      // const familyId = ObjectId('5fad9a57b22305000424a62d');
      // const userId = ObjectId('5fad99c3b22305000424a62b');
      await Promise.all(
        transes.map(
          // async ({ amount, transactionDate, type, category, comment }) => {
          //   await transactionModel.create({
          //     amount,
          //     transactionDate,
          //     type,
          //     category,
          //     comment,
          //     familyId,
          //     userId,
          //   });

          async (trans) => {
            // trans.amount = '130000';
            trans.amount = 3 * trans.amount;
            //   trans.familyId = familyId;
            //   trans.userId = userId;
            await trans.save();
            // await transactionModel.findByIdAndDelete(trans._id);
          },
        ),
      );
      return responseNormalizer(200, res, { transes });
    } catch (e) {
      errorHandler(req, res, e);
    }
  }
}

module.exports = new TransactionController();
