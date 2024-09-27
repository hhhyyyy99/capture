import { registerLogger, unregisterLogger } from './log'

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
}
export async function unregisterIPC() {
  unregisterLogger()
}