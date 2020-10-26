const Joi = require('Joi');
const { familyModel } = require('../database/modules');
const { ApiError, errorHandler, getLogger } = require('../helpers');

const logger = getLogger("gifts");

class giftsController {
  constructor() { }

  get unpackGift() {
    return this._unpackGift.bind(this);
  }

  async _unpackGift(req, res) {
    try {

      const { verificationToken, familyId } = req.user;

      if (verificationToken) {
        throw new ApiError(401, "unauthorized error");
      }

      if (!familyId) {
        throw new ApiError(403, "user not a member of family");
      }

      const family = await familyModel.findById(familyId)

      const familyUpdate = await familyModel.findByIdAndUpdate(familyId, {
        giftsForUnpacking: family.decrementGiftsForUnpacking(),
        giftsUnpacked: family.incrementGiftsUnpacked(),
      }, { new: true })

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

