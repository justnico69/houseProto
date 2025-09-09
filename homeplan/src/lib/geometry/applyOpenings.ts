// src/lib/geometry/applyOpenings.ts
import * as THREE from 'three'
import { CSG } from 'three-js-csg'
import { Opening } from '../../store/types'

/**
 * Takes a wall mesh and cuts out doors/windows based on openings
 */
export function applyOpenings(wallMesh: THREE.Mesh, openings: Opening[]): THREE.Mesh {
  if (!wallMesh.geometry) return wallMesh

  // Clone wall geometry for CSG
  let wallCSG = CSG.fromMesh(wallMesh)

  openings.forEach((opening) => {
    // Create box for the opening
    const box = new THREE.BoxGeometry(opening.width, opening.height, wallMesh.geometry.boundingBox?.max.z ?? 0.1)
    const mesh = new THREE.Mesh(box)
    mesh.position.set(opening.offset, opening.sillHeight ?? 0, 0) // x = along wall, y = sill, z = thickness
    const openingCSG = CSG.fromMesh(mesh)

    // Subtract opening from wall
    wallCSG = wallCSG.subtract(openingCSG)
  })

  // Convert back to mesh
  const newMesh = CSG.toMesh(wallCSG, wallMesh.matrix, wallMesh.material)
  newMesh.castShadow = true
  newMesh.receiveShadow = true
  return newMesh
}
