import { isFunction } from "radash"

const getSources = async () => {
  const sources = await window.api.getDesktopCapturerSource()
  const sourceMap = sources.map((source) => {
    const thumbnailFn = source.thumbnail
    const processedThumbnail = {}
    for (const key in thumbnailFn) {
      if (Object.prototype.hasOwnProperty.call(thumbnailFn, key)) {
        const element = thumbnailFn[key]
        // 检查 element 是否是一个函数
        if (isFunction(element)) {
          // 如果是函数，则执行它并返回结果
          try {
            processedThumbnail[key] = element()
          } catch (e) {
          }
        } else {
          // 如果不是函数，则直接返回值
          processedThumbnail[key] = element
        }
      }
    }
    return { ...source, thumbnailValue: processedThumbnail }
  })
  return sourceMap
}