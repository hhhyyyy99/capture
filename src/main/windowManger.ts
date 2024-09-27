import { BrowserView, BrowserWindow, shell } from 'electron'
import EventEmitter from 'events'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { registerIPC } from './ipc'

class WindowManager extends EventEmitter {
  public $win: BrowserWindow | null = null
  public $view: BrowserView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  constructor() {
    super()
    this.createWindow()
  }
  async createWindow() {
    this.$win = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    await registerIPC()
    
    this.$win?.on('ready-to-show', () => {
      this.$win?.show()
    })

    this.$win?.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.$win?.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.$win?.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }
}

export default WindowManager
