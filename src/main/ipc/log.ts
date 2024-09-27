import { ipcMain } from 'electron'
import logger from '../utils/logger'
import { Logger } from '@constants/Logger'

export function registerLogger() {
  ipcMain.on(
    'logger',
    (_, { type, message, error }: { type: Logger; message: string; error?: Error }) => {
      switch (type) {
        case Logger.INFO:
          logger.info(message)
          break
        case Logger.WARN:
          logger.warn(message)
          break
        case Logger.ERROR:
          logger.error(message)
          break
        case Logger.DEBUG:
          logger.debug(message)
          break
        case Logger.LOG_PROCESS_ERROR:
          logger.logProcessError(message, error)
          break
        default:
          break
      }
    }
  )
}

export function unregisterLogger() {
  ipcMain.removeAllListeners('logger')
}
