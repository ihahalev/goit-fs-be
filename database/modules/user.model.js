const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const joi = require("joi");
const jsonWebToken = require("jsonwebtoken");
const config = require("../../config.env");
const { Timestamp, ObjectId } = require("mongodb");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      validate: {
        validator(email) {
          const { error } = joi.string().email().validate(email);

          if (error) throw new Error("Email not vlid");
        },
      },
    },
    passwordHash: { type: String },
    familyId: { type: ObjectId, default: null },
    tokens: [
      {
        token: { type: String, required: true },
        expires: { type: Date, required: true },
      },
    ],
    verificationToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.static("hashPassword", (password) => {
  const costFactor = 6;
  return bcrypt.hash(password, costFactor);
});

UserSchema.method("isPasswordValid", function (password) {
  return password.compare(password, this.passwordHash);
});

UserSchema.method("generateAndSaveToken", async function () {
  const token = jsonWebToken.sign({ id: this._id }, config.jwtPrivateKey);

  this.tokens.push({
    token,
    expires: new Date().getTime() + 24 * 60 * 60 * 1e3,
  });
  await this.save();

  return token;
});

UserSchema.pre("save", async function () {
  if (this.isNew) {
    this.passwordHash = await this.constructor.hashPassword(this.passwordHash);
  }
});

module.exports = mongoose.model("User", UserSchema);
