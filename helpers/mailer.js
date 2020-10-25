const nodemailer = require('nodemailer');
const config = require('../config.env');
const getLogger = require('./get-logger');

class Mailer {
  constructor() {
    this.logger = getLogger('mailer');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass,
      },
    });
  }

  async init() {
    this.logger.info('Creating transporter');
    await this._transport;
  }

  async sendVerificationMail(userEmail, token) {
    await this.transporter.sendMail({
      from: config.mail.auth.user,
      to: userEmail,
      subject: 'Verification Email',
      html: `<a href="${config.srvUrl}/api/user/verify/${token}">Verify email</a>`,
    });
  }
}

module.exports = new Mailer();
