console.log('BooBoo');
const yaml = require('yaml')

const data = [
  {
    name: "Perl Test (1)",
    pass: 4,
    fail: 1,
    ok: false,
  },
  {
    name: "Perl Test (2)",
    pass: 32,
    fail: 0,
    ok: true,
  },
  {
    name: "Perl Test (3)",
    pass: 414,
    fail: 0,
    ok: true,
  },
  {
    name: "Jest Test",
    pass: 4,
    fail: 1,
    ok: false,
  },
  {
    name: "Frontend Lint",
    pass: 0,
    fail: 0,
    ok: true,
  }
]


/*
:honeybee:
:beetle:
:lady_beetle:
:cricket
:cockroach:
:spider:
:spider_web:
:scorpion:
:mosquito:
:fly:
:worm::microbe:
*/
// data must be an array of non-nested objects.
// Use ultra micro template.
function renderSummary (data) {

}


module.exports = function (opts) {
  return [`# summary
 - hoge
 - moge
  `, `# Title
  hoge moge is foo bar
`]
}


