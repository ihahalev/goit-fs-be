
const Joi = require('Joi');
const { familyModel, userModel } = require('../database/modules');
const { ApiError, errorHandler, validate, getLogger } = require('../helpers');

const logger = getLogger("FamiliesController");

class FamilyController {
  constructor() {
    this.validCreatedFamilyObject = Joi.object({
      totalSalary: Joi.number().required(),
      passiveIncome: Joi.number().required(),
      incomePercentageToSavings: Joi.number().required(),
      balance: Joi.number().required(),
      flatPrice: Joi.number().required(),
      flatSquareMeters: Joi.number().required(),
    });
    this.validUpdateFamilyObject = Joi.object({
      totalSalary: Joi.number().required(),
      passiveIncome: Joi.number().required(),
      incomePercentageToSavings: Joi.number().required(),
      flatPrice: Joi.number().required(),
      flatSquareMeters: Joi.number().required(),
    });
  }

  get createFamily() {
    return this._createFamily.bind(this);
  }

  get getCurrentFamily() {
    return this._currentFamily.bind(this);
  }

  get updateFamily() {
    return this._updateFamily.bind(this);
  }

  async _createFamily(req, res) {
    try {

      validate(this.validCreatedFamilyObject, req.body);

      const { _id: id, familyId } = req.user;

      if (familyId) {
        throw new ApiError(409, "user already created family/is a part of family");
      };

      const createdFamily = await familyModel.create(req.body);

      req.user.familyId = createdFamily._id;
      req.user.save();

      return res.status(201).send(createdFamily);

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
  }

  async _currentFamily(req, res) {
    try {

      const { verificationToken, familyId } = req.user;

      if (verificationToken) {
        throw new ApiError(401, "unauthorized error");
      }

      const currentFamily = await familyModel.findById(familyId)

      const { totalSalary, passiveIncome, incomePercentageToSavings, flatPrice, flatSquareMeters } = currentFamily;

      return res.status(200).send({
        totalSalary,
        passiveIncome,
        incomePercentageToSavings,
        flatPrice,
        flatSquareMeters,
      });

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
  }

  async _updateFamily(req, res) {
    try {

      validate(this.validUpdateFamilyObject, req.body);

      const { verificationToken, familyId } = req.user;

      if (verificationToken) {
        throw new ApiError(401, "user is not authorized");
      }

      const familyToUpdate = await familyModel.findByIdAndUpdate(familyId, req.body, { new: true })

      const { flatPrice, flatSquareMeters, totalSalary,
        passiveIncome, incomePercentageToSavings } = familyToUpdate;

      return res.status(200).send({
        totalSalary,
        passiveIncome,
        incomePercentageToSavings,
        flatPrice,
        flatSquareMeters,
      });

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
  };

}

module.exports = new FamilyController();
