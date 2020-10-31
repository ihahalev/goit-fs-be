const { userModel } = require('../database/models');

class GoogleController {
  constructor() {}
  async findOrCreate(profile, callback) {
    try {
      const { email } = profile._json;
      const displayName = email.substring(0, email.indexOf('@'));
      const user = userModel.update(
        email,
        {
          $setOnInsert: {
            name: displayName,
            email,
            verificationToken: null,
          },
        },
        { upsert: true },
      );
      const token = await user.generateAndSaveToken();
      callback(null, { token });
    } catch (err) {
      callback(err, null);
    }
  }

  redirectGoogle(req, res) {
    res.redirect(`/?token=${req.user.token}`);
  }
}
module.exports = new GoogleController();
