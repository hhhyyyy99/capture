import { BrowserView, BrowserWindow, shell } from 'electron'
import EventEmitter from 'events'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { registerIPC } from './ipc'
import { getDisplay } from './utils/tools'

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
  }
  async createWindow() {
    if(this.$win) return
    const display = getDisplay()
    this.$win = new BrowserWindow({
      width: 900,
      height: 670,
      show: false,
      autoHideMenuBar: true,
      // webPreferences: {
      //   preload: join(__dirname, '../preload/index.js'),
      //   sandbox: false
      // }
    })

    // this.$win = new BrowserWindow({
    //   title: 'screenshots',
    //   x: display.x,
    //   y: display.y,
    //   width: display.width,
    //   height: display.height,
    //   useContentSize: true,
    //   type: 'darwin',
    //   frame: false,
    //   show: true,
    //   autoHideMenuBar: true,
    //   transparent: true,
    //   resizable: false,
    //   movable: false,
    //   minimizable: false,
    //   maximizable: false,
    //   // focusable 必须设置为 true, 否则窗口不能及时响应esc按键，输入框也不能输入
    //   focusable: true,
    //   skipTaskbar: true,
    //   alwaysOnTop: !is.dev,
    //   /**
    //    * linux 下必须设置为false，否则不能全屏显示在最上层
    //    * mac 下设置为false，否则可能会导致程序坞不恢复问题，且与 kiosk 模式冲突
    //    */
    //   fullscreen: false,
    //   // mac fullscreenable 设置为 true 会导致应用崩溃
    //   fullscreenable: false,
    //   kiosk: true,
    //   backgroundColor: '#00000000',
    //   titleBarStyle: 'hidden',
    //   hasShadow: false,
    //   paintWhenInitiallyHidden: false,
    //   // mac 特有的属性
    //   roundedCorners: false,
    //   enableLargerThanScreen: false,
    //   acceptFirstMouse: true,
    //   webPreferences: {
    //     preload: join(__dirname, '../preload/index.js'),
    //     sandbox: false
    //   }
    // })

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
    this.$win?.webContents.openDevTools()
  }
  async closeWindow() {
    if (this.$win) {
      this.$win.destroy()
      this.$win = null
    }
  }
}

export default new WindowManager()
