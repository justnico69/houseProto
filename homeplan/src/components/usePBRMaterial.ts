// src/components/usePBRMaterial.ts
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function usePBRMaterial(basePath: string) {
  const [map, normalMap, roughnessMap, aoMap] = useTexture([
    `${basePath}_basecolor.jpg`,
    `${basePath}_normal.jpg`,
    `${basePath}_roughness.jpg`,
    `${basePath}_ao.jpg`,
  ])
  return new THREE.MeshStandardMaterial({
    map,
    normalMap,
    roughnessMap,
    aoMap,
  })
}
