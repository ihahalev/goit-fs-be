const loggerWarnMock = require("./logger-warn-mock");
const loggerErrorMock = require("./logger-error-mock");

module.exports = jest.fn().mockImplementation(() => ({
  error: loggerErrorMock,
  warn: loggerWarnMock
}));
