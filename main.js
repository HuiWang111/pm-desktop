const { app, BrowserWindow } = require('electron')
const { join } = require('path')
const { format } = require('url')
const isDev = require('electron-is-dev')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'src/preload.js')
    }
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