const express = require("express");
const router = express.Router();

// const authCheck = require("../middlewares/auth-check");

const { ApiError, getLogger } = require("../helpers");

const FamilieModel = require("../database/models/FamilieModel");

const logger = getLogger("gifts");

router.put("/unpack", async (req, res) => {
  try {

    const { valid, familyId } = req.user;

    if (valid) {
      throw new ApiError(401, "user is not authorized");
    }

    if (!familyId) {
      throw new ApiError(403, "user not a member of family");
    }

    const familyUpdate = await FamilieModel.findByIdAndUpdate(familyId, {
      giftsForUnpacking: await user.decrementGiftsForUnpacking(),
      giftsUnpacked: await user.incrementGiftsUnpacked(),
    })

    return res.status(200).send({
      giftsForUnpacking: familyUpdate.giftsForUnpacking
    });

  } catch (e) {
    logger.error(e);
  }

});

module.exports = router;
