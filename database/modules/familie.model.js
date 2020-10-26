const mongoose = require("mongoose");

const { Schema } = mongoose;

const FamilieSchema = new Schema({
  usersId: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
  balance: { type: Number, default: 0, required: false },
  flatPrice: { type: Number, default: 0, required: true },
  flatSquareMeters: { type: Number, default: 0, required: true },
  giftsUnpacked: { type: Number, default: 0 },
  giftsForUnpacking: { type: Number, default: 0 },
  totalSalary: { type: Number, default: 0, required: true },
  passiveIncome: { type: Number, default: 0, required: true },
  incomePercentageToSavings: { type: Number, default: 0, required: true },
},
  { timestamps: true }
);

FamilieSchema.method("decrementGiftsForUnpacking", function () {
  this.giftsForUnpacking = this.giftsForUnpacking - 1;

  return this.giftsForUnpacking;
});

FamilieSchema.method("incrementGiftsUnpacked", function () {
  this.giftsUnpacked = this.giftsUnpacked + 1;

  return this.giftsUnpacked;
});

FamilieSchema.pre("save", function () {
  if (this.isNew) {
    this.giftsForUnpacking = this.constructor.decrementGiftsForUnpacking(this.giftsForUnpacking);

    this.giftsUnpacked = this.constructor.incrementGiftsUnpacked(this.giftsUnpacked);
  }
});

module.exports = mongoose.model("Familie", FamilieSchema);
