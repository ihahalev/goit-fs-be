const express = require("express");
const morgan = require("morgan");
const path = require("path");

const { familiesRouter } = require('./routers');

const app = express();

app.use(morgan("tiny"));
app.use(express.urlencoded());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/api/families", familiesRouter);

module.exports = app;
