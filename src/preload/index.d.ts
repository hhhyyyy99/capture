import { ElectronAPI } from '@electron-toolkit/preload'
import { Rectangle } from 'electron'

export interface Display extends Rectangle {
  id: number
  scaleFactor: number,
  id,
  x: number,
  y: number,
  width: number,
  height: number,
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getDesktopCapturerSource: () => Promise<Electron.DesktopCapturerSource[]>
      getDisplay: () => Promise<Display>
    }
    logger: {
      info: (message: string) => void
      error: (message: string) => void
      debug: (message: string) => void
      warn: (message: string) => void
    }
  }
}
