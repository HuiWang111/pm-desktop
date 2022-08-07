const { exec } = require('child_process')
const { join } = require('path')

const cwd = process.cwd()

function run(command, options) {
  return new Promise((resolve, reject) => {
    const child = exec(command, options)

    child.stdout.on('data', (data) => {
      console.info('stdout: ' + data)
    })
    child.stderr.on('data', (data) => {
      console.info('stderr: ' + data)
      reject()
    })
    child.stdout.on('close', (code) => {
      console.info('closing code: ' + code)
      resolve()
    })
  })
}

function getCwdPath(...args) {
  return join(cwd, ...args)
}

module.exports = {
  run,
  getCwdPath
}
