// src/lib/geometry/polylineToWallMesh.ts
import * as THREE from 'three'
import type { Wall } from '../../store/plan'

export function polylineToWallMesh(wall: Wall) {
  const shape = new THREE.Shape()
  const pts = wall.points.map((p) => new THREE.Vector2(p.x, p.y))
  if (pts.length < 2) return new THREE.Mesh()
  shape.moveTo(pts[0].x, pts[0].y)
  pts.slice(1).forEach((p) => shape.lineTo(p.x, p.y))

  const extrudeSettings = { depth: wall.height, bevelEnabled: false }
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}
