import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    logger: {
      info: (message: string) => void
      error: (message: string) => void
      debug: (message: string) => void
      warn: (message: string) => void
    }
  }
}
