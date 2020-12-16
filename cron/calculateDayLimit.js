const cron = require('node-cron');
const { familyModel, transactionModel } = require('../database/models');

const { getLogger, daysToMonthEnd } = require('../helpers');
const logger = getLogger('calculateDayLimit');

async function main() {
  try {
    await cron.schedule('0 0 * * *', async function () {
      const allFamilies = await familyModel.find({});

      await Promise.all(
        allFamilies.map(async (item) => {
          const { _id } = item;

          const monthBalance = await transactionModel.getFamilyMonthBalance(
            _id,
          );

          const desiredSavings = item.getDesiredSavings();
          const available = monthBalance - desiredSavings;
          const dailySum = available / daysToMonthEnd();

          await familyModel.findByIdAndUpdate(
            _id,
            {
              dayLimit: dailySum.toFixed(2),
              monthLimit: available.toFixed(2),
            },
            { new: true },
          );
        }),
      );

      logger.info(
        `FamilyModel update  dailyLimit and monthLimit every day of (00:00)`,
      );
    });
  } catch (err) {
    logger.error(err);
  }
}

module.exports = main;
