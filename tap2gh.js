const fs = require('fs')
const parser = require('tap-parser')

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
    || (id ? 'Test #' + id + ' Failed' : 'Test failed')
  return { text, info: { title, file, startLine }, result }
}

module.exports = run
