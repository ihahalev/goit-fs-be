const Joi = require('Joi');
const { FamilieModel } = require('../database/modules');
const { ApiError, errorHandler, getLogger } = require('../helpers');

const logger = getLogger("gifts");

class giftsController {
  constructor() { }

  get updateGifts() {
    return this._updateGifts.bind(this);
  }

  async _updateGifts(req, res) {
    try {

      const { verificationToken, familyId } = req.user;

      if (verificationToken) {
        throw new ApiError(401, "unauthorized error");
      }

      if (!familyId) {
        throw new ApiError(403, "user not a member of family");
      }

      const family = await FamilieModel.findById(familyId)

      const familyUpdate = await FamilieModel.findByIdAndUpdate(familyId, {
        giftsForUnpacking: family.decrementGiftsForUnpacking(),
        giftsUnpacked: family.incrementGiftsUnpacked(),
      })

      const { giftsForUnpacking } = familyUpdate;

      return res.status(200).send({
        giftsForUnpacking
      });

    } catch (err) {
      logger.error(err)
      errorHandler(req, res, err);
    }
  };
}

module.exports = new giftsController();

