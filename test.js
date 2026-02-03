console.log("This is a test file.");
const _ = require('lodash');
const arr = [1, 2, 3, 4, 5];
console.log(_.shuffle(arr));

const dayjs = require('dayjs');
console.log("Current Date and Time:", dayjs().format());