const Joi = require('joi');
const { familyModel } = require('../database/models');
const { ApiError, errorHandler, getLogger } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');

const logger = getLogger('FamiliesController');

class FamilyController {
  async createFamily(req, res) {
    try {
      const { familyId } = req.user;

      if (familyId) {
        throw new ApiError(
          409,
          'user already created family/is a part of family',
        );
      };

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
    };
  };

  async getCurrentFamily(req, res) {
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
    };
  };

  async getStatsFlatFamily(req, res) {
    try {
      const { familyId } = req.user;

      const familyCurrent = await familyModel.findById(familyId);

      const { giftsUnpacked, giftsForUnpacking, flatPrice, balance, flatSquareMeters, totalSalary, passiveIncome, incomePercentageToSavings } = familyCurrent;

      const savingsPercentage = Math.ceil((balance * 100) / (flatPrice));
      const savingsValue = balance;
      const savingsInSquareMeters = giftsUnpacked;
      const totalSquareMeters = flatSquareMeters;

      const costSquareMeter = Math.ceil(flatPrice / flatSquareMeters);

      const monthsLeftToSaveForFlat = Math.ceil((flatPrice - balance) / ((totalSalary + passiveIncome) * incomePercentageToSavings / 100))

      const savingsForNextSquareMeterLeft = Math.ceil((costSquareMeter - balance) * 100 / costSquareMeter);

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
    };
  };

  async updateFamily(req, res) {
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
        },
      });

    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    };
  };

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
      };

      next();
    } catch (e) {
      errorHandler(req, res, e);
    };
  };

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
    };
  };
};

module.exports = new FamilyController();
