const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')
const { format } = require('url')
const isDev = require('electron-is-dev')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1440,
    height: 768,
    webPreferences: {
      preload: join(__dirname, 'src/preload.js')
    },
    minWidth: 800,
    minHeight: 600,
    frame: isDev
  })

  if (isDev) {
    win.loadURL('http://127.0.0.1:5173')
  } else {
    win.loadURL(format({
      pathname: join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true,
    }))
  }

  ipcMain.on('min', () => {
    win.minimize()
  })

  ipcMain.on('max', () => {
    if (win.isMaximized()) {
      win.restore()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('close', () => {
    win.close()
  })

  ipcMain.handle('isMaximized', () => win.isMaximized())
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
