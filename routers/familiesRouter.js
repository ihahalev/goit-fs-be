const express = require("express");
const router = express.Router();

const joi = require('joi');
// const authCheck = require("../middlewares/auth-check");

const responseNormalizer = require('../helpers/response-normalizer')
const { ApiError, getLogger, validate } = require("../helpers");

const { FamilieModel } = require("../database/models");

const logger = getLogger("FamiliesRouter");

router.post("/", async (req, res) => {
  try {

    if (!Object.keys(req.body).length) {
      const err = { message: "validation failed" };
      return res.status(400).send(responseNormalizer(err));
    }

    validate(
      joi
        .object({
          totalSalary: joi.number().required(),
          passiveIncome: joi.number().required(),
          incomePercentageToSavings: joi.number().required(),
          balance: joi.number().required(),
          flatPrice: joi.number().required(),
          flatSquareMeters: joi.number().required(),
        }),
      req.body
    )

    const { totalSalary, passiveIncome, incomePercentageToSavings, balance, flatPrice, flatSquareMeters } = req.body;

    const { _id: id, familyId } = req.user;

    if (familyId) {
      throw new ApiError(409, "Familie in use");
    }

    const createdFamilie = await FamilieModel.create({ totalSalary, passiveIncome, incomePercentageToSavings, balance, flatPrice, flatSquareMeters });

    createdFamilie.usersId = id;
    createdFamilie.save();

    req.user.familyId = createdFamilie._id;
    req.user.save();

    return res.status(201).send({
      balance,
      flatPrice,
      flatSquareMeters,
      totalSalary,
      passiveIncome,
      incomePercentageToSavings,
      id: createdFamilie._id,
    });

  } catch (e) {
    logger.error(e);
    return res.status(500).send(responseNormalizer(e));
  }

});

router.get("/current", async (req, res) => {
  try {

    const { _id: userId, valid } = req.user;

    if (valid) {
      throw new ApiError(401, "user is not authorized");
    }

    const userCurrent = await UserModel.findById(userId);

    return res.status(200).send(userCurrent);

  } catch (e) {
    logger.error(e);
  }

});


router.put("/", async (req, res) => {
  try {

    if (!Object.keys(req.body).length) {
      const err = { message: "validation failed" };
      return res.status(400).send(responseNormalizer(err));
    }

    validate(
      joi
        .object({
          totalSalary: joi.number().required(),
          passiveIncome: joi.number().required(),
          incomePercentageToSavings: joi.number().required(),
          balance: joi.number().required(),
          flatPrice: joi.number().required(),
          flatSquareMeters: joi.number().required(),
        }),
      req.body
    )


    const { _id: userId, valid } = req.user;

    if (valid) {
      throw new ApiError(401, "user is not authorized");
    }

    const userToUpdate = await UserModel.findById(userId);

    if (!userToUpdate) {
      throw new ApiError(404, "user is not member of a family");
    }

    Object.keys(req.body).forEach((key) => {
      userToUpdate[key] = req.body[key];
    });

    const updateUser = await userToUpdate.save();

    return res.status(200).send(updateUser);

  } catch (e) {
    logger.error(e);
  }

});

module.exports = router;
