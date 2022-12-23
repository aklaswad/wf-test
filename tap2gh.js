#!/usr/bin/env node
const fs = require('fs')
const glob = require('glob')
const parser = require('tap-parser')

function run () {
  glob("tapout/t/*.t", (er, files) => {
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
                finalize_annotation(result, anno_buf)
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
    annotations.forEach( ann => console.log(ann))

  })
}

function finalize_annotation (result, buf) {
  const subject = buf[0].replace(/^#\s+/,'')
  buf[1].match(/^#\s+at\s+(\S+)\s+line\s+(\d+)/);
  const file = RegExp.$1
  const line = RegExp.$2
  const text =
    buf
      .slice(2)
      .map( l => {
        l.replace(/^#/,'')
          .replace(/\n/g, '%0A')
          .replace(/\r/g, '%0D')
          .replace(/%/g, '%25')
      })
      .join('')
  return `::error file=${file},line=${line}::${text}`
}

module.exports = run
