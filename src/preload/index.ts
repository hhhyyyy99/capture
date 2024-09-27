import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Logger } from '@constants/Logger'

// Custom APIs for renderer
const api = {
}
const logger = {
  info: (message: string) => {
    electronAPI.ipcRenderer.send('logger', { type: Logger.INFO, message: message })
  },
  error: (message: string) => {
    electronAPI.ipcRenderer.send('logger', { type: Logger.ERROR, message: message })
  },
  warn: (message: string) => {
    electronAPI.ipcRenderer.send('logger', { type: Logger.WARN, message: message })
  },
  debug: (message: string) => {
    electronAPI.ipcRenderer.send('logger', { type: Logger.DEBUG, message: message })
  },
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('logger', logger)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.logger = logger
}
