const mongoose = require('mongoose');
const {
  Types: { ObjectId },
} = mongoose;
const { transactionCategories, transactionTypes } = require('../staticData');

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    transactionDate: { type: Date, required: true },
    type: {
      type: String,
      enum: transactionTypes,
      default: transactionTypes[0],
      required: true,
    },
    category: {
      type: String,
      enum: transactionCategories,
      default: transactionCategories[0],
      required: true,
    },
    comment: String,
    familyId: { type: ObjectId, ref: 'Family' },
    userId: { type: ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

transactionSchema.static('getFamilyAnnualReport', async function (
  familyId,
  month,
  startYear,
) {
  const startMonth = String(month + 1).padStart(2, '0');
  const endMonth = String(month).padStart(2, '0');
  const startDate = `${startYear}-${startMonth}-01`;
  console.log(startDate);
  const endDate = `${startYear - 1}-${endMonth}-01`;
  console.log(endDate);
  return this.aggregate([
    {
      $match: {
        familyId: `${familyId}`,
      },
    },
    {
      $match: {
        transactionDate: {
          $gte: new Date(`${endDate}`),
          $lt: new Date(`${startDate}`),
        },
      },
    },
    {
      $addFields: {
        transactionDate: '$transactionDate',
        year: { $year: '$transactionDate' },
        month: { $month: '$transactionDate' },
        incomeAmount: {
          $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
        },
        expenses: {
          $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
        },
        percentAmount: {
          $cond: [{ $eq: ['$type', 'PERCENT'] }, '$amount', 0],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$transactionDate',
          },
        },
        incomeAmount: { $sum: '$incomeAmount' },
        expenses: { $sum: '$expenses' },
        percentAmount: { $sum: '$percentAmount' },
      },
    },
    {
      $addFields: {
        savings: { $subtract: ['$incomeAmount', '$expenses'] },
        expectedSavings: {
          $multiply: ['$incomeAmount', '$percentAmount', 0.01],
        },
        year: {
          $year: {
            date: {
              $dateFromString: { dateString: { $concat: ['$_id', '-01'] } },
            },
          },
        },
        month: {
          $month: {
            date: {
              $dateFromString: { dateString: { $concat: ['$_id', '-01'] } },
            },
          },
        },
      },
    },
    { $sort: { _id: -1 } },
  ]);
});

module.exports = mongoose.model('Transaction', transactionSchema);
