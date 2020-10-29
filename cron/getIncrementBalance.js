const cron = require('node-cron');
const { familyModel } = require('../database/models');

const { getLogger } = require('../helpers');
const logger = getLogger('getIncrementBalance');

async function main() {
  try {
    await cron.schedule('1 * * * *', async function () {

      const families = await familyModel.find({});

      families.forEach((item) => {
        item.balance = item.totalSalary + item.passiveIncome;
        item.giftsForUnpacked = item.balance / item.flatSquareMeters;
        return item.save();
      })

      logger.info(`FamilyModel increment balance 1-st day of month (00:00)`);

      return true;
    });

  } catch (err) {
    logger.error(err);
  }
}

module.exports = main;