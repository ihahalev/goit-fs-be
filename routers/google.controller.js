const { userModel } = require('../database/models');
const configEnv = require('../config.env');

class GoogleController {
  constructor() {}
  async findOrCreate(profile, callback) {
    try {
      const { email } = profile._json;
      console.log(email);
      const displayName = email.substring(0, email.indexOf('@'));
      const user = await userModel.findOneAndUpdate(
        { email },
        {
          $setOnInsert: {
            name: displayName,
          },
        },
        { upsert: true, new: true },
      );
      console.log(user);
      const token = await user.generateAndSaveToken();
      callback(null, { token });
    } catch (err) {
      callback(err, null);
    }
  }

  redirectGoogle(req, res) {
    res.redirect(`${configEnv.hostUrl}/?token=${req.user.token}`);
  }
}
module.exports = new GoogleController();
