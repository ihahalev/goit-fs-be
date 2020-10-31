const configEnv = require('../config.env');

module.exports = {
  clientID: configEnv.google.clientId,
  clientSecret: configEnv.google.clientSecret,
  callbackURL: `http://localhost:${configEnv.port}/auth/google/callback`,
};
