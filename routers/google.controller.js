const { userModel } = require('../database/models');

class GoogleController {
  constructor() {}
  async findOrCreate(profile, callback) {
    try {
      const { email } = profile._json;
      const displayName = email.substring(0, email.indexOf('@'));
      const foundUser = await userModel.findOne({ email });
      if (!foundUser) {
        const newUser = await userModel.create({
          name: displayName,
          email,
          verificationToken: null,
        });
        const token = await newUser.generateAndSaveToken();
        callback(null, { token });
      } else {
        const token = await foundUser.generateAndSaveToken();
        callback(null, { token });
      }
    } catch (err) {
      callback(err, null);
    }
  }

  redirectGoogle(req, res) {
    res.redirect(`/?token=${req.user.token}`);
  }
}
module.exports = new GoogleController();
