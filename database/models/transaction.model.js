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
  const endMonth = String(month + 1).padStart(2, '0');
  const startDate = `${startYear}-${startMonth}-01`;
  const endDate = `${startYear - 1}-${endMonth}-01`;
  return this.aggregate([
    {
      $match: {
        familyId,
      },
    },
    {
      $match: {
        transactionDate: {
          $gte: new Date(endDate),
          $lt: new Date(startDate),
        },
      },
    },
    {
      $addFields: {
        transactionDate: '$transactionDate',
        incomeAmount: {
          $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
        },
        expenses: {
          $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
        },
        percentAmount: {
          $cond: [{ $eq: ['$type', 'PERCENT'] }, '$amount', null],
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
        percentAmount: { $avg: '$percentAmount' },
        // comment: { $addToSet: '$comment' },
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

transactionSchema.static('monthlyAccrual', async function (
  income,
  percent,
  userId,
  familyId,
  isNew = false,
) {
  let groupRes = [];
  if (!isNew) {
    const date = new Date();
    const month = String(date.getMonth()).padStart(2, '0');
    const startDate = `${date.getFullYear()}-${month}-01`;
    groupRes = await this.aggregate([
      {
        $match: {
          familyId: familyId,
        },
      },
      {
        $match: {
          transactionDate: { $lt: new Date(startDate) },
        },
      },
      {
        $addFields: {
          transactionDate: '$transactionDate',
          amount: { $ifNull: ['$amount', 0] },
          incomeAmount: {
            $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
          },
          expenses: {
            $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
          },
        },
      },
      {
        $group: {
          _id: null,
          incomeAmount: { $sum: '$incomeAmount' },
          expenses: { $sum: '$expenses' },
          totalSavings: { $sum: { $subtract: ['$incomeAmount', '$expenses'] } },
        },
      },
    ]);
  }
  await this.create({
    amount: income,
    type: 'INCOME',
    category: 'Доход',
    comment: 'Ежемесячное начисление',
    familyId,
    userId,
    transactionDate: Date.now(),
  });
  await this.create({
    amount: percent,
    type: 'PERCENT',
    category: 'Ожидаемые сбережения',
    comment: 'Процент от дохода',
    familyId,
    userId,
    transactionDate: Date.now(),
  });

  if (groupRes.length) {
    const [{ totalSavings }] = groupRes;
    if (!Number.isInteger(totalSavings)) {
      return 0;
    }
    return totalSavings;
  } else {
    return 0;
  }
});

transactionSchema.static('getFamilyMonthBalance', async function (familyId) {
  const date = new Date();
  const month = String(date.getMonth()).padStart(2, '0');
  const startDate = `${date.getFullYear()}-${month}-01`;
  const groupRes = await this.aggregate([
    {
      $match: {
        familyId: familyId,
      },
    },
    {
      $match: {
        transactionDate: { $gte: new Date(startDate) },
      },
    },
    {
      $addFields: {
        transactionDate: '$transactionDate',
        amount: { $ifNull: ['$amount', 0] },
        incomeAmount: {
          $cond: [{ $eq: ['$type', 'INCOME'] }, '$amount', 0],
        },
        expenses: {
          $cond: [{ $eq: ['$type', 'EXPENSE'] }, '$amount', 0],
        },
      },
    },
    {
      $group: {
        _id: null,
        incomeAmount: { $sum: '$incomeAmount' },
        expenses: { $sum: '$expenses' },
        monthBalance: { $sum: { $subtract: ['$incomeAmount', '$expenses'] } },
      },
    },
  ]);
  console.log(groupRes);
  if (groupRes.length) {
    const [{ monthBalance }] = groupRes;
    if (!Number.isInteger(monthBalance)) {
      return 0;
    }
    return monthBalance;
  } else {
    return 0;
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
