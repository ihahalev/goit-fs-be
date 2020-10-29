const cron = require('node-cron');
const { familyModel } = require('../database/models');

const { getLogger } = require('../helpers');
const logger = getLogger('incrementBalance');

async function main() {
  try {
    await cron.schedule('0 0 1 * *', async function () {

      const families = await familyModel.find({});

      families.forEach((item) => {
        item.balance = item.totalSalary + item.passiveIncome;
        return item.save();
      })

      logger.info(`FamilyModel increment balance 1-st day of month (00:00)`);
    });

  } catch (err) {
    logger.error(err);
  }
}

module.exports = main;