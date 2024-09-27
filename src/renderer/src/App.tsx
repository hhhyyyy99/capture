import { useRef, useState, useCallback, useEffect } from 'react'
import electronLogo from './assets/electron.svg'
import { useAsyncRetry } from 'react-use'

function App(): JSX.Element {
  // 框选区域的ref
  const screenshotRef = useRef<HTMLDivElement>(null)
  const [currentWindow, setCurrentWindow] = useState<Electron.DesktopCapturerSource | null>(null)
  const [displays, setDisplays] = useState<Electron.Display[]>([])

  const { value: sources } = useAsyncRetry(async () => {
    return window.api.getDesktopCapturerSource()
  }, [])

  useEffect(() => {
    const getDisplays = async () => {
      const displayInfo = await window.api.getDisplays()
      setDisplays(displayInfo)
    }
    getDisplays()
  }, [])

  // 当前屏幕的所有窗口
  sources && console.log(sources)
  // source 的thumbnail只有这些方法addRepresentation crop getAspectRatio getBitmap getNativeHandle getScaleFactors getSize isEmpty isMacTemplateImage isTemplateImage resize setTemplateImage toBitmap toDataURL toJPEG toPNG
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // 获取鼠标位置
      const { clientX, clientY } = event
      
      // 找到鼠标所在的窗口
      const currentSource = sources?.find((source) => {
        const { width, height } = source.thumbnail.getSize()
        const display = displays.find(d => d.id === parseInt(source.display_id))
        if (!display) return false

        const x = display.bounds.x
        const y = display.bounds.y

        return clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height
      })

      // 如果找到了新的窗口,更新状态
      if (currentSource && currentSource.id !== currentWindow?.id) {
        setCurrentWindow(currentSource)
        console.log('当前窗口:', currentSource.name)
      }
    },
    [sources, currentWindow, displays]
  )

  return (
    <div className="screenshot-container" onMouseMove={handleMouseMove}>
      <div ref={screenshotRef}></div>
      {currentWindow && (
        <div className="current-window-info">
          当前窗口: {currentWindow.name}
        </div>
      )}
    </div>
  )
}

export default App
