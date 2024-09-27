// logger.js
import log from 'electron-log'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'

// 确保日志目录存在
const logDir = path.join(app.getPath('userData'), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}
// 配置日志文件保存位置
log.transports.file.resolvePathFn = () => path.join(logDir, 'main.log')

// 设置日志级别
log.transports.file.level = 'info'
log.transports.console.level = 'debug'

// 定制日志格式
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} {text}'
log.transports.console.format = '{y}-{m}-{d} {h}:{i}:{s} {text}'

// 封装日志方法
function info(message) {
  log.info(message)
}

function warn(message) {
  log.warn(message)
}

function error(message) {
  log.error(message)
}

function debug(message) {
  log.debug(message)
}

function logProcessError(process, error) {
  log.error(`Error in process ${process}: ${error.message}`)
}
const logger = {
  info,
  warn,
  error,
  debug,
  logProcessError,
  log
}
export type Logger = typeof logger
// 导出log对象以便直接访问其他方法
export default logger
