'use strict';

exports.onHandleCode = function onHandleCode(ev) {
  var code_trimmed = ev.data.code.trim();
  if (code_trimmed.startsWith('(function(){') && code_trimmed.endsWith('}).call(this);') && code_trimmed.includes("out$ = typeof exports != 'undefined' && exports || this;")) {
    code_trimmed = code_trimmed.split("out$ = typeof exports != 'undefined' && exports || this;").join("out$ = exports || this;")
    code_trimmed = code_trimmed.substr('(function(){'.length);
    code_trimmed = code_trimmed.substr(0, code_trimmed.lastIndexOf('}).call(this);'))
    let output_code_lines = ["'use strict';", '/* this is not json */'];
    for (let line of code_trimmed.split('\n')) {
      if (line.includes("out$ = typeof exports != 'undefined' && exports || this;")) {
        continue
      }
      if (line.includes('gexport')) {
        continue
      }
      if (line.includes('ref$')) {
        continue
      }
      if (line.includes('import$')) {
        continue
      }
      let modification_allowed = true
      if (line.includes('(async function') || line.includes('(function')) {
        modification_allowed = false
      }
      if (modification_allowed && line.trim().startsWith('out$.') && line.includes(' = ') && (line.includes('= function(') || line.includes('= async function('))) {
        let modified_line = line.substr(0, line.indexOf('out$.')) + 'export var ' + line.substr(line.indexOf(' = ') + 3)
        output_code_lines.push(modified_line)
      } else {
        output_code_lines.push(line)
      }
    }
    code_trimmed = output_code_lines.join('\n')
    ev.data.code = code_trimmed
  }
  return;
};
