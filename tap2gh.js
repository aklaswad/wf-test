/*

# tap2gh.js by aklaswad

This script will do thigs below
  * Read all tapout files (*.t) from specified dir
  * Parse them and correct test results
  * Annotate errors using core.error
    ** https://github.com/actions/toolkit/tree/main/packages/core#annotations
  * (optional) Delete successed test log files
  * Returns a quick summary for reuse in your workflow

# Options
  glob (required): need this from actions/github-script.
  process (required): ditto
  core (required): ditto
  path: string (optional)
    specify the directory which tapout files are exists.
    if it's started from '/' or '.', just use it as is.
    else, read it as relative path from GITHUB_WORKSPACE.
    default: './t/'
  delete: boolean (optional)
    if it's true, delete *.t files which processed and test all passed
    default: false

# Return value

  A object will be returned. It contains
  {
    pass: 43,  // Num of tests which passed
    fail: 3,   // Num of tests which fail
    total: 46, // Num of tests which processed
    files: 3,  // Num of files processed
    path: '/blah/t' // abs path which this script has actually tried
  }

# How To Use

This script is depends on npm module 'tap-parser', so
you need to install npm modules before running this script
It may looks like...

```
jobs:
  perltest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - env:
          PERL_TEST_HARNESS_DUMP_TAP: ./tapout/
        run: prove --merge t
      - uses: actions/setup-node@v3
      - run: npm ci
      - uses: actions/github-script@v6
        with:
          script: |
            const tap2gh = require('./tap2gh.js')
            const result = tag2gh({
              process, glob, core,
              path: 'tapout'
            })
            return { pass: res.pass, fail: res.fail, total: res.total }
```

*/

const fs = require('fs')
const parser = require('tap-parser')

function main (opts) {
  const { core, glob, process, path, delete }

}

function run (files) {
  const annotations = []
  let pass = 0
  let fail = 0
  let total = 0

  for ( const file of files ) {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = parser.Parser.parse(content)
    let anno_buf = []
    let collecting = false;
    let complete
    for ( const line of lines ) {
      const [type, result] = [...line]
      if ( collecting ) {
        if ( type === 'comment' ) {
          anno_buf.push(result)
        }
        else {
          collecting = false
          if ( annotations.length < 10 ) {
            annotations.push(
              finalize_annotation(anno_buf, result.name, result.fullname, result.id)
            )
          }
          anno_buf = []
        }
      }
      if ( type === 'assert' && !result.ok ) {
        collecting = result
      }
      else if ( type === 'complete' ) {
        pass += result.pass
        fail += result.fail
        total += result.count
      }
    }
  }

  return { total, pass, fail, annotations }
}

function finalize_annotation (buf, name, fullname, id) {
  if ( buf.length < 2 ) {
    return {}
  }
  const title = buf[0].replace(/^#\s+/,'')
  buf[1].match(/^#\s+at\s+(\S+)\s+line\s+(\d+)/);
  const file = RegExp.$1
  const startLine = RegExp.$2
  const text =
    buf
      .slice(2)
      .map( l => l.replace(/^#/,'') )
      .join('')
    || name
    || fullname
    || title
    || (id ? 'Test #' + id + ' Failed' : 'Test failed')
  return { text, info: { title, file, startLine } }
}

module.exports = run
