const mongoose = require("mongoose");

const { Schema } = mongoose;

const FamilieSchema = new Schema({
  usersId: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
  balance: { type: Number, default: 0, required: true },
  flatPrice: { type: Number, default: 0, required: true },
  flatSquareMeters: { type: Number, default: 0, required: true },
  giftsUnpacked: { type: Number, default: 0 },
  giftsForUnpacking: { type: Number, default: 0 },
  totalSalary: { type: Number, default: 0, required: true },
  passiveIncome: { type: Number, default: 0, required: true },
  incomePercentageToSavings: { type: Number, default: 0, required: true },
},
  {
    timestamps: true
  }
);

FamilieSchema.method("decrementGiftsForUnpacking", async function (value) {
  this.giftsForUnpacking = this.giftsForUnpacking - value;
  await this.save();
  return giftsForUnpacking;
});

FamilieSchema.method("incrementGiftsUnpacked", async function (value) {
  this.giftsUnpacked = this.giftsUnpacked + value;
  await this.save();
  return giftsUnpacked;
});

module.exports = mongoose.model("Familie", FamilieSchema);
