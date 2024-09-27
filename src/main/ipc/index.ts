import { desktopCapturer, ipcMain, screen } from 'electron'
import { registerLogger, unregisterLogger } from './log'
import { EV_SEND_DESKTOP_CAPTURER_SOURCE } from '@constants/Channel'
import { selfWindws } from '../utils/tools'

export class IPC {
  public ipc = null
  constructor() {}
  async registerIPC() {
    if (!this.ipc) {
      registerLogger()
    }
  }
  async unregisterIPC() {
    unregisterLogger()
  }
}
export async function registerIPC() {
  registerLogger()
  ipcMain.handle(EV_SEND_DESKTOP_CAPTURER_SOURCE, async (event, arg) => {
    return [
      ...(await desktopCapturer.getSources({ types: ['window', 'screen'] })),
      ...(await selfWindws())
    ]
  })
}
export async function unregisterIPC() {
  unregisterLogger()
  ipcMain.removeAllListeners(EV_SEND_DESKTOP_CAPTURER_SOURCE)
}

ipcMain.handle('get-displays', () => {
  return screen.getAllDisplays()
})
