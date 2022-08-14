const { readFileSync, writeFileSync } = require('fs')
const { join } = require('path')
const { run, getCwdPath } = require('./utils')
const os = require('os')

main()

async function main() {
  try {
    const pkgPath = getCwdPath('package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    const { version } = JSON.parse(readFileSync(getCwdPath('scripts/cache/version.json')))

    if (pkg.version === version) {
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

