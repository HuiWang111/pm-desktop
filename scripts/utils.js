const { exec } = require('child_process')
const { join } = require('path')

const cwd = process.cwd()

function run(command, options) {
  return new Promise((resolve, reject) => {
    const child = exec(command, options)

    child.stdout.on('data', (data) => {
      console.info(data)
    })
    child.stdout.on('error', (error) => {
      reject(error)
    })
    child.stdout.on('close', (code) => {
      console.info('close: ' + code)
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
