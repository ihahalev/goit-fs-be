// const nodemailer = require("nodemailer");
// // const sgMail = require('@sendgrid/mail');
// const getLogger = require("./get-logger");
// const configEnv = require("../config.env");

// class Mailer {
//   constructor() {
//     this.logger = getLogger("mailer");
//     // nodemailer direct sender
//     this._transport = nodemailer.createTransport(configEnv.mail);

//     // smtp nodemailer + sendgrid
//     // this.transporter = nodemailer.createTransport(configEnv.smtp);
//   }

//   async init() {
//     this.logger.info("Creating transporter");

//     // nodemailer direct sender
//     // await this._transport;

//     // sendgrid API
//     // sgMail.setApiKey(configEnv.mail.SGKey);

//     // smtp nodemailer + sendgrid
//     await this.transporter;
//   }

//   async sendMailFromSupport({ to, subject, text, html }) {
//     this.logger.debug("Sending email");
//     this.logger.debug("to ->", to);
//     this.logger.debug("subject ->", subject);
//     text && this.logger.debug("text ->", text);
//     html && this.logger.debug("html ->", html);

//     // nodemailer direct sender
//     return this._transport.sendMail({
//       from: configEnv.mail.auth.user,
//       to: Array.isArray(to) ? to.join(", ") : to,
//       subject,
//       text,
//       html,
//     });
//   }
//   // sendgrid API
//   // return sgMail.send({
//   //   to: Array.isArray(to) ? to.join(', ') : to,
//   //   from: configEnv.mail.SGUser,
//   //   subject,
//   //   text,
//   //   html,
//   // });

//   // smtp nodemailer + sendgrid
//   //   return this.transporter.sendMail({
//   //     from: `"Support" <${configEnv.mail.SGUser}>`,
//   //     to: Array.isArray(to) ? to.join(", ") : to,
//   //     subject,
//   //     text,
//   //     html,
//   //   });
//   // }

//   async sendText({ to, subject, text }) {
//     return this.sendMailFromSupport({ to, subject, text });
//   }

//   async sendHtml({ to, subject, html }) {
//     return this.sendMailFromSupport({ to, subject, html });
//   }
// }

// module.exports = new Mailer();

const nodemailer = require("nodemailer");
const config = require("../config.env");

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass,
      },
    });
  }

  async sendMail(userEmail, token) {
    await this.transporter.sendMail({
      from: config.mail.auth.user,
      to: userEmail,
      subject: "Verification Email",
      html: `<a href="${config.srvUrl}/api/auth/verify/${token}">Verify email</a>`,
    });
  }
}

module.exports = new Mailer();
