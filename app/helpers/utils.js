const moment = require('moment');

exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум не включается, минимум включается
};

exports.getRandomAmount = (min, max) => {
  const amount = Math.random() * (max - min) + min;
  return amount.toFixed(2);
};

exports.randomDate = () => {
  const startDate = moment().subtract(this.getRandomInt(1, 15), "days").subtract(this.getRandomInt(0, 59), 'minute');
  const endDate = moment(startDate).add(this.getRandomInt(10, 59), 'minute');
  const duration = moment.duration(endDate.diff(startDate)).asMinutes();
  return {
    startDate: startDate.utc().local(),
    endDate: endDate.utc().local(),
    duration
  };
}

exports.resultReduce = arr =>
  arr.reduce((acc, cur) => {
    if (!acc.hash[cur]) {
      acc.hash[cur] = { [cur]: 1 };
      acc.map.set(acc.hash[cur], 1);
      acc.result.push(acc.hash[cur]);
    } else {
      acc.hash[cur][cur] += 1;
      acc.map.set(acc.hash[cur], acc.hash[cur][cur]);
    }
    return acc;
  }, {
    hash: {},
    map: new Map(),
    result: []
  });