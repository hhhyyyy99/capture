import { useEffect, useRef, useState, useCallback } from 'react'
import { Point, Rect } from './types'

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rect, setRect] = useState<Rect>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } })
  const [isDragging, setIsDragging] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 })

  const initCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const display = await window.api.getDisplay()
    canvas.width = display.width
    canvas.height = display.height
    
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const { x, y, width, height } = getRectDimensions(rect)
    ctx.clearRect(x, y, width, height)
    
    // 添加边框
    ctx.strokeStyle = 'blue'
    ctx.strokeRect(x, y, width, height)
  }, [rect])

  const getRectDimensions = (r: Rect) => ({
    x: Math.min(r.start.x, r.end.x),
    y: Math.min(r.start.y, r.end.y),
    width: Math.abs(r.end.x - r.start.x),
    height: Math.abs(r.end.y - r.start.y)
  })

  const isPointInRect = useCallback((point: Point) => {
    const { x, y, width, height } = getRectDimensions(rect)
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height
  }, [rect])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const point = { x: e.clientX, y: e.clientY }
    if (isPointInRect(point)) {
      setIsDragging(true)
      const { x, y } = getRectDimensions(rect)
      setDragOffset({ x: point.x - x, y: point.y - y })
    } else {
      setIsDrawing(true)
      setRect({ start: point, end: point })
    }
  }, [rect, isPointInRect])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const point = { x: e.clientX, y: e.clientY }
    if (isDragging) {
      const newStart = { x: point.x - dragOffset.x, y: point.y - dragOffset.y }
      const width = rect.end.x - rect.start.x
      const height = rect.end.y - rect.start.y
      setRect({ start: newStart, end: { x: newStart.x + width, y: newStart.y + height } })
    } else if (isDrawing) {
      setRect(prev => ({ ...prev, end: point }))
    }
    drawCanvas()
  }, [isDragging, isDrawing, dragOffset, rect, drawCanvas])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsDrawing(false)
  }, [])

  return (
    <div
      className="screenshot-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas id="screenshot-canvas" className="screenshot-canvas" ref={canvasRef} />
    </div>
  )
}

export default App
