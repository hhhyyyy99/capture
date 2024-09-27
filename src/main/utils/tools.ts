import { webContents, BrowserWindow, Rectangle, screen } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { Display } from '@constants/Display'

// 修复electron18.0.0-beta.5 之后版本的BUG: 无法获取当前程序页面视频流
export const selfWindws = async () =>
  await Promise.all(
    webContents
      .getAllWebContents()
      .filter((item) => {
        const win = BrowserWindow.fromWebContents(item)
        return win && win.isVisible()
      })
      .map(async (item) => {
        const win = BrowserWindow.fromWebContents(item)
        const thumbnail = await win?.capturePage()
        // 当程序窗口打开DevTool的时候  也会计入
        return {
          name: win?.getTitle() + (item.devToolsWebContents === null ? '' : '-dev'), // 给dev窗口加上后缀
          id: win?.getMediaSourceId(),
          thumbnail,
          display_id: '',
          appIcon: null
        }
      })
  )

  export interface Display extends Rectangle {
    id: number
    scaleFactor: number
  }
  
export const getDisplay = (): Display => {
  const point = screen.getCursorScreenPoint()
  const { id, bounds, scaleFactor } = screen.getDisplayNearestPoint(point)

  // https://github.com/nashaofu/screenshots/issues/98
  return {
    id,
    x: Math.floor(bounds.x),
    y: Math.floor(bounds.y),
    width: Math.floor(bounds.width),
    height: Math.floor(bounds.height),
    scaleFactor
  }
}

export function rendererPath(window: BrowserWindow, fileName: string) {
 const url =  mainUrl(fileName)
 window.loadURL(url)
 if (is.dev) {
  window.webContents.openDevTools()
 }
}
function mainUrl(fileName: string) {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      const mainUrl = `${process.env['ELECTRON_RENDERER_URL']}/${fileName}`;
      return mainUrl;
  }
  return `${join(__dirname, "../renderer", fileName)}`;
}