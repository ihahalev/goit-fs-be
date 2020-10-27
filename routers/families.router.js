const express = require("express");
const familiesRouter = express.Router();
const familiesController = require('./families.controller');

const authorization = require('../middlewares/auth');

familiesRouter.post("/", authorization,
  familiesController.validateCreatedFamilyObject,
  familiesController.createFamily,
);

familiesRouter.get("/current", authorization,
  familiesController.getCurrentFamily,
);

familiesRouter.put("/", authorization,
  familiesController.validateUpdateFamilyObject,
  familiesController.updateFamily,
);

module.exports = familiesRouter;
