const Joi = require('joi');
const { familyModel } = require('../database/models');
const transactionModel = require('../database/models/transaction.model');
const { ApiError, errorHandler, getLogger } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');

const logger = getLogger('FamiliesController');

class FamilyController {
  get createFamily() {
    return this._createFamily.bind(this);
  }

  get getCurrentFamily() {
    return this._currentFamily.bind(this);
  }

  get getStatsFlatFamily() {
    return this._getStatsFlatFamily.bind(this);
  }

  get updateFamily() {
    return this._updateFamily.bind(this);
  }

  async _createFamily(req, res) {
    try {
      const { familyId } = req.user;

      if (familyId) {
        throw new ApiError(
          409,
          'user already created family/is a part of family',
        );
      }

      const createdFamily = await familyModel.create(req.body);

      req.user.familyId = createdFamily._id;
      req.user.save();

      const {
        balance,
        flatPrice,
        flatSquareMeters,
        totalSalary,
        passiveIncome,
        incomePercentageToSavings,
        giftsUnpacked,
        giftsForUnpacking,
      } = createdFamily;

      return responseNormalizer(201, res, {
        info: {
          balance,
          flatPrice,
          flatSquareMeters,
          totalSalary,
          passiveIncome,
          incomePercentageToSavings,
        },
        gifts: {
          giftsUnpacked,
          giftsForUnpacking,
        }
      });

    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    }
  }

  async _currentFamily(req, res) {
    try {
      const { familyId } = req.user;

      const currentFamily = await familyModel.findById(familyId);

      const { balance,
        flatPrice,
        flatSquareMeters,
        totalSalary,
        passiveIncome,
        incomePercentageToSavings,
        giftsUnpacked,
        giftsForUnpacking,
      } = currentFamily;

      return responseNormalizer(200, res, {
        info: {
          balance,
          flatPrice,
          flatSquareMeters,
          totalSalary,
          passiveIncome,
          incomePercentageToSavings,
        },
        gifts: {
          giftsUnpacked,
          giftsForUnpacking,
        }
      });


    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    }
  }

  async _updateFamily(req, res) {
    try {
      const { familyId } = req.user;

      const familyToUpdate = await familyModel.findByIdAndUpdate(
        familyId,
        req.body,
        { new: true },
      );

      const { balance,
        flatPrice,
        flatSquareMeters,
        totalSalary,
        passiveIncome,
        incomePercentageToSavings,
        giftsUnpacked,
        giftsForUnpacking,
      } = familyToUpdate;

      return responseNormalizer(200, res, {
        info: {
          balance,
          flatPrice,
          flatSquareMeters,
          totalSalary,
          passiveIncome,
          incomePercentageToSavings,
        },
        gifts: {
          giftsUnpacked,
          giftsForUnpacking,
        }
      });

    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    }
  }

  async _getStatsFlatFamily(req, res) {
    try {
      const { familyId } = req.user;

      const familyCurrent = await familyModel.findById(familyId);
      const transactionCurrent = await transactionModel.findById(familyId);

      const { giftsForUnpacking } = familyCurrent;
      const {
        savingsPercentage,
        savingsValue,
        savingsInSquareMeters,
        totalSquareMeters,
        monthsLeftToSaveForFlat,
        savingsForNextSquareMeterLeft } = transactionCurrent;

      return responseNormalizer(200, res, {
        savingsPercentage,
        savingsValue,
        savingsInSquareMeters,
        totalSquareMeters,
        monthsLeftToSaveForFlat,
        savingsForNextSquareMeterLeft,
        giftsForUnpacking,
      });

    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    }
  }


  validateCreatedFamilyObject(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        totalSalary: Joi.number().required(),
        passiveIncome: Joi.number().required(),
        incomePercentageToSavings: Joi.number().required(),
        balance: Joi.number().required(),
        flatPrice: Joi.number().required(),
        flatSquareMeters: Joi.number().required(),
      }).validate(req.body);

      if (validationError) {
        throw new ApiError(400, 'Bad request', validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }

  validateUpdateFamilyObject(req, res, next) {
    try {
      const { error: validationError } = Joi.object({
        totalSalary: Joi.number().required(),
        passiveIncome: Joi.number().required(),
        incomePercentageToSavings: Joi.number().required(),
        flatPrice: Joi.number().required(),
        flatSquareMeters: Joi.number().required(),
      }).validate(req.body);

      if (validationError) {
        throw new ApiError(400, 'Bad request', validationError);
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
  }
}

module.exports = new FamilyController();
