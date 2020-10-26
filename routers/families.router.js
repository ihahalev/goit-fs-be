const express = require("express");
const familiesRouter = express.Router();
const familiesController = require('./families.controller');

const authorization = require('../middlewares/auth');

familiesRouter.post("/", authorization,
  familiesController.createFamily,
);

familiesRouter.get("/current", authorization,
  familiesController.currentFamily,
);

familiesRouter.put("/", authorization,
  familiesController.updateFamily,
);

module.exports = familiesRouter;
