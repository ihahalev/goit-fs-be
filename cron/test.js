const cron = require('node-cron');

async function main() {
  await cron.schedule('* * * * *', function () {
    console.log('Запуск завдання Cron');
  });
}

module.exports = main;