console.log('BooBoo');
const yaml = require('yaml')

const data = [
  {
    name: "Perl Test (1)",
    pass: 4,
    fail: 1,
    total: 5,
    ok: false,
  },
  {
    name: "Perl Test (2)",
    pass: 32,
    fail: 0,
    total: 32,
    ok: true,
  },
  {
    name: "Perl Test (3)",
    pass: 414,
    fail: 0,
    total: 414,
    ok: true,
  },
  {
    name: "Jest Test",
    pass: 4,
    fail: 1,
    total: 5,
    ok: false,
  },
  {
    name: "Frontend Lint",
    pass: 0,
    fail: 0,
    total: 0,
    ok: true,
  }
]

function aggregate (summaries) {
  const result = summaries.reduce( (acc,cur) => ({
    ok: acc.ok && cur.ok,
    pass: acc.pass + cur.pass,
    fail: acc.fail + cur.fail,
    total: acc.total + cur.total,
    numFiles: acc.numFiles + 1,
    annotations: [ ...acc.annotations, ...(cur.annotations || []) ]
  }), {
    ok: true,
    pass: 0,
    fail: 0,
    total: 0,
    numFiles: 0,
    annotations: []
  })
  return result
}

function bugs () {
  const bugs = [
':honeybee:',
':beetle:',
':lady_beetle:',
':cricket:',
':cockroach:',
':spider:',
':spider_web:',
':scorpion:',
':mosquito:',
':fly:',
':worm:',
':microbe:',
':orangutan:',
]
  return bugs[ Math.floor((Math.random() * bugs.length)) ]
}

// data must be an array of non-nested objects.
// Use ultra micro template.
function renderSummary (data, context) {
  const t = aggregate(data)
  t.name = '**Total**'
  const summary = `
# Test Result for ${context.sha.substr(0,8)}

| ok | suite | pass | fail | total |
|----|-------|------|------|-------|` + data.map( d => `
|${d.ok ? ':white_check_mark:' : bugs()}|${d.name}|${d.pass}|${d.fail}|${d.total}|`) + `
|${t.ok}|${t.name}|${t.pass}|${t.fail}|${t.total}|`
return summary
}


module.exports = function (opts) {
  return [
  renderSummary(data, opts.context),
  `# Title
  hoge moge is foo bar
`]
}


