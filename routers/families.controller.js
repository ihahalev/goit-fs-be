
const Joi = require('Joi');
const { familyModel } = require('../database/modules');
const { ApiError, errorHandler, getLogger } = require('../helpers');

const logger = getLogger("FamiliesController");

class FamilyController {

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

      const { familyId } = req.user;

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

      const { familyId } = req.user;

      const currentFamily = await familyModel.findById(familyId)

      return res.status(200).send(currentFamily);

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
  }

  async _updateFamily(req, res) {
    try {

      const { familyId } = req.user;

      const familyToUpdate = await familyModel.findByIdAndUpdate(familyId, req.body, { new: true })

      return res.status(200).send(familyToUpdate);

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
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
      }

      next();
    } catch (e) {
      errorHandler(req, res, e);
    }
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
    }
  };

}

module.exports = new FamilyController();
