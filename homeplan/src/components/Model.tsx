// src/components/Model.tsx
import { useGLTF } from '@react-three/drei'
import React from 'react'

type ModelProps = { glbPath: string }
export const Model: React.FC<ModelProps> = ({ glbPath }) => {
  const gltf = useGLTF(glbPath)
  return <primitive object={gltf.scene.clone()} dispose={null} />
}
