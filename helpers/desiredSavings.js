module.exports = function () {
  const sum = Number(this.totalSalary) + Number(this.passiveIncome);
  const savings = (sum * Number(this.incomePercentageToSavings)) / 100;
  return savings.toFixed(2);
};
