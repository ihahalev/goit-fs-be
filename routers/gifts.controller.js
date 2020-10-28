const { familyModel } = require('../database/models');
const { ApiError, errorHandler, getLogger } = require('../helpers');
const responseNormalizer = require('../normalizers/response-normalizer');

const logger = getLogger('gifts');

class giftsController {
  constructor() {}

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
          giftsForUnpacking: family.decrementGiftsForUnpacking(),
          giftsUnpacked: family.incrementGiftsUnpacked(),
        },
        { new: true },
      );

      const { giftsForUnpacking } = familyUpdate;

      return responseNormalizer(200, res, {
        giftsForUnpacking,
      });
    } catch (err) {
      logger.error(err);
      errorHandler(req, res, err);
    }
  }
}

module.exports = new giftsController();
