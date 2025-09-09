// src/lib/utils/math.ts

export function screenToWorld(stage: Stage, evt: any): { x: number; y: number } {
  const pos = stage.getPointerPosition()
  return pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 }
}
