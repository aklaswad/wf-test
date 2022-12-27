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
async function renderSummary (data, context, github) {
  const repo = context.payload.repository
  const run = await github.rest.actions.getWorkflowRun({
    owner: repo.owner.login,
    repo: repo.name,
    run_id: context.runId
  })
  console.dir(run.data)
  let prLink = ''
  if ( run.data.pull_requests ) {
    prLink = '[details](' + repo.html_url + '/pull/' + run.data.pull_requests[0].number + '/commits/' + context.sha + ')'
  }
  const jobs = await github.rest.actions.listJobsForWorkflowRun({
    owner: repo.owner.login,
    repo: repo.name,
    run_id: context.runId
  })
  console.dir(jobs.data.jobs)
  const t = aggregate(data)
  t.name = '**Total**'
  const summary = `
# Test Result for ${context.sha.substr(0,8)}

| suite | ok | pass | fail | total |
|-------|----|------|------|-------|` + data.map( d => `
|<br>${d.name}<br>| ${d.ok ? ':white_check_mark:' : ':x:'}|${d.pass}:heavy_check_mark:|**${d.fail}${d.fail ? ':x:' : '' }**|${d.total}|`) + `
|${t.name}        | ${t.ok ? ':white_check_mark:' : ':x:'}|${t.pass}:heavy_check_mark:|**${t.fail}${t.fail ? ':x:' : '' }**|${t.total}|

${prLink}

`
return summary
}


module.exports = async function (opts) {
  return [ await renderSummary(data, opts.context, opts.github),
  `# Title
  hoge moge is foo bar
`]
}


