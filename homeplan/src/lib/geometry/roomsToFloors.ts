// src/lib/geometry/roomsToFloors.ts
import * as THREE from 'three'
import type { Room } from '../../store/plan'


export function roomsToFloors(room: Room) {
  const shape = new THREE.Shape(room.polygon.map(p => new THREE.Vector2(p.x, p.y)))
  const geometry = new THREE.ShapeGeometry(shape)
  const material = new THREE.MeshStandardMaterial({ color: 0x888888 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2 // floor horizontal
  mesh.receiveShadow = true
  return mesh
}
