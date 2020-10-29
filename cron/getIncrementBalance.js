const cron = require('node-cron');
const { familyModel, userModel, transactionModel } = require('../database/models');

const { getLogger } = require('../helpers');
const logger = getLogger('getIncrementBalance');

async function main() {
  try {
    await cron.schedule('0 0 1 * *', async function () {

      const allFamilies = await familyModel.find({});

      await Promise.all(allFamilies.map(async item => {

        item.balance += item.totalSalary + item.passiveIncome;
        item.giftsForUnpacking = Math.floor((item.balance * item.flatSquareMeters / item.flatPrice) - item.giftsUnpacked)
        await item.save();

        const user = await userModel.findOne({ familyId: item.familyId });
        const sum = item.totalSalary + item.passiveIncome;

        // awaiting transactionModal realization 
        item.balance = await transactionModel.mounthlyAccrual(sum, item.incomePercentageToSavings, user._id, item._id);
        await item.save();
      }));

      logger.info(`FamilyModel increment balance 1-st day of month (00:00)`);

    });

  } catch (err) {
    logger.error(err);
  }
}

module.exports = main;