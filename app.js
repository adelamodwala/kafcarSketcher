import logger from './logger';
import Rx from 'rx';

console.log('app loaded');

let myArr = [];
for(let i = 0; i < 10; i++) {
  myArr = [
    ...myArr,
    i * i
  ]
  console.log(myArr);
}
logger('bob','belcher');
