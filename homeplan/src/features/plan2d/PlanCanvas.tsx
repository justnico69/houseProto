// src/features/plan2d/PlanCanvas.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import { v4 as uuidv4 } from 'uuid'
import { screenToWorld } from '../../lib/utils/math'
import simplify from '../../lib/utils/simplifyDP'; // we'll implement DP simplifier
import { Point2, usePlanStore, Wall } from '../../store/plan'

type Tool = 'select' | 'pencil' | 'wall' | 'eraser' | 'measure'
const GRID_SIZE = 25 // px for grid; we will treat 1 px = 1 cm for demonstration

export const PlanCanvas: React.FC = () => {
  const stageRef = useRef<any>(null)
  const addWall = usePlanStore((s) => s.pushWall)
  const [tool, setTool] = useState<Tool>('select')
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPoints, setCurrentPoints] = useState<Point2[]>([])
  const [scale, setScale] = useState(1)

  // snap settings
  const [snapCm, setSnapCm] = useState(5) // 5 cm grid snapping

  useEffect(() => {
    // keyboard shortcuts
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') setTool('pencil')
      if (e.key === '2') setTool('wall')
      if (e.key === 'g' || e.key === 'G') {
        // toggle grid -> for demo just toggles snap size
        setSnapCm((s) => (s === 5 ? 25 : 5))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleMouseDown = (e: any) => {
    if (tool === 'pencil' || tool === 'wall') {
      setIsDrawing(true)
      const pos = screenToWorld(stageRef.current, e.evt)
      setCurrentPoints([pos])
    }
  }

  const handleMouseMove = (e: any) => {
    if (!isDrawing) return
    const pos = screenToWorld(stageRef.current, e.evt)
    setCurrentPoints((p) => [...p.slice(-500), pos]) // limit
  }

  const handleMouseUp = (e: any) => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (tool === 'pencil') {
      // simplify and convert to wall polyline candidate
      const simplified = simplify(currentPoints.map((p) => [p.x, p.y]), 2)
      const pts = simplified.map(([x, y]) => ({ x, y }))
      // convert px -> meters (example: 100 px = 1 m). We'll set scale later
      const newWall: Wall = {
        id: uuidv4(),
        points: pts,
        thickness: 0.12, // 12cm
        height: 2.7, // 2.7m
        materialId: 'brick_wall',
      }
      addWall(newWall)
    } else if (tool === 'wall') {
      // straight polyline: snap endpoints to grid
      const snapped = currentPoints.map((pt) => ({
        x: Math.round(pt.x / (snapCm)) * snapCm,
        y: Math.round(pt.y / (snapCm)) * snapCm,
      }))
      const newWall: Wall = {
        id: uuidv4(),
        points: snapped,
        thickness: 0.12,
        height: 2.7,
        materialId: 'brick_wall',
      }
      addWall(newWall)
    }
    setCurrentPoints([])
  }

  // build grid lines for background
  const gridLines = []
  const W = 2000
  const H = 1200
  for (let x = 0; x <= W; x += GRID_SIZE) gridLines.push(<Line key={`gx-${x}`} points={[x, 0, x, H]} stroke="#eee" strokeWidth={1} />)
  for (let y = 0; y <= H; y += GRID_SIZE) gridLines.push(<Line key={`gy-${y}`} points={[0, y, W, y]} stroke="#eee" strokeWidth={1} />)

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex gap-2 items-center">
        <button onClick={() => setTool('select')} className="btn">Select (Esc)</button>
        <button onClick={() => setTool('pencil')} className="btn">Pencil (1)</button>
        <button onClick={() => setTool('wall')} className="btn">Wall (2)</button>
        <div>Snap: {snapCm} cm</div>
      </div>

      <div className="flex-1 bg-white relative">
        <Stage
          ref={stageRef}
          width={W}
          height={H}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ background: '#fafafa' }}
        >
          <Layer>
            {/* grid */}
            {gridLines}
            {/* current drawing */}
            {currentPoints.length > 0 && (
              <Line
                points={currentPoints.flatMap((p) => [p.x, p.y])}
                stroke={tool === 'pencil' ? '#333' : '#0077ff'}
                strokeWidth={tool === 'pencil' ? 2 : 3}
                lineCap="round"
                lineJoin="round"
              />
            )}
            {/* TODO: render existing walls from store (simple preview) */}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default PlanCanvas
