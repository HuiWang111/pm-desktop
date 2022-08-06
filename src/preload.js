const { contextBridge, clipboard, ipcRenderer } = require('electron')
const { join } = require('path')
const { createPM } = require('@kennys_wang/pm-node-service')
const { readFileSync } = require('fs')

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
const defaultConfig = pkg.configuration

const passwordManager = createPM(defaultConfig)

contextBridge.exposeInMainWorld('pm', {
  getList: () => passwordManager.getList(),
  createAccount: (data) => passwordManager.create(data.account, data.password, data.board, data.remark),
  deleteAccount: (id) => passwordManager.delete([id]),
  copyPassword: async (id) => {
    const item = passwordManager.get(id, '')
    clipboard.writeText(item.password)
  },
  getAccount: (id, mask) => passwordManager.get(id, mask),
  remarkAccount: (id, remark) => passwordManager.remark(id, remark),
  editAccount: (id, pwd) => passwordManager.edit(id, pwd),
  moveAccount: (id, board) => passwordManager.move(id, board),
  findAccounts: (keyword, mask) => passwordManager.find(keyword, mask),
  getArchivedAccounts: (mask) => passwordManager.getArchive(mask),
  clearArchivedAccounts: () => passwordManager.clean(),
  restore: (ids) => passwordManager.restore(ids),
  hasMainPassword: () => passwordManager.hasMainPassword(),
  validateMainPassword: (pwd) => passwordManager.validateMainPassword(pwd),
  setMainPassword: (pwd) => passwordManager.setMainPassword(pwd),
})

contextBridge.exposeInMainWorld('os', {
  setWin: (type) => ipcRenderer.send(type),
  isMaximized: () => ipcRenderer.invoke('isMaximized')
})
