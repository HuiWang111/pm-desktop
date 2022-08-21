const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { run, getCwdPath } = require('./utils')
const os = require('os')
const argsParser = require('yargs-parser')

main()

async function main() {
  try {
    const argv = withDefauls(argsParser(process.argv.slice(2)), {
      compress: true,
      force: false
    })
    const pkgPath = getCwdPath('package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    const { version } = JSON.parse(readFileSync(getCwdPath('scripts/cache/version.json')))

    if (!argv.force && pkg.version === version) {
      throw new Error('should update scripts/cache/version.json')
    }

    pkg.version = version
    pkg.config.forge.packagerConfig.appVersion = version

    writeFileSync(
      pkgPath,
      JSON.stringify(pkg, null, 2),
      'utf8'
    )

    console.log('=================== start to build web app ============================')
    await run('yarn build')

    console.log('================= start to build electron app =========================')
    await run('yarn make')
    
    if (!argv.compress) {
      return
    }
      
    console.log('====================== start to make zip ==============================')
    const zipName = `PasswordManager-${version}.zip`
    await run(`7z a ${zipName} ./out/PasswordManager-win32-x64/`)

    console.log('====================== start to move zip ==============================')
    await run(`move ./${zipName} ${join(os.homedir(), 'Desktop')}`, {
      cwd: process.cwd()
    })
  } catch (e) {
    console.error('error: ' + e)
  }
}

function withDefauls(obj, defaults) {
  const result = { ...obj }

  for (const key in defaults) {
    if (typeof result[key] === 'undefined') {
      result[key] = defaults[key]
    }
  }

  return result
}

