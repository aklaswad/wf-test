console.log('BooBoo');
const yaml = require('yaml')
module.exports = function () { console.log(yaml.stringify({ aaa: 42, bbb: { c: 42, d: [ 1,2,3,4,6]}})) }
