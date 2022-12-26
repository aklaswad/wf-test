console.log('BooBoo');
const yaml = require('yaml')
module.exports = function (opts) {
  console.log(yaml.stringify({ aaa: 42, bbb: { c: 42, d: [ 1,2,3,4,6]}}))
  console.dir(opts)
}


