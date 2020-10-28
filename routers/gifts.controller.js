const { familyModel } = require('../database/models');
const { ApiError, errorHandler, getLogger } = require('../helpers');

const logger = getLogger('gifts');

class giftsController {
  constructor() { }

  get unpackGift() {
    return this._unpackGift.bind(this);
  }

  async _unpackGift(req, res) {
    try {
      const { familyId } = req.user;

      if (!familyId) {
        throw new ApiError(404, 'user not a member of family');
      }

      const family = await familyModel.findById(familyId);

      const familyUpdate = await familyModel.findByIdAndUpdate(
        familyId,
        {
          giftsForUnpacking: family.incrementGiftsUnpacked(),
          giftsUnpacked: family.decrementGiftsForUnpacking(),
        },
        { new: true },
      );

      const { giftsForUnpacking, giftsUnpacked } = familyUpdate;

      return res.status(200).send({
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
}

module.exports = new giftsController();
