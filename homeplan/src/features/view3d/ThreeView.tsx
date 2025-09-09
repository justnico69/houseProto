// src/features/view3d/ThreeView.tsx
import { Environment, OrbitControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense } from 'react'
import { polylineToWallMesh } from '../../lib/geometry/polylineToWallMesh'
import { roomsToFloors } from '../../lib/geometry/roomsToFloors'
import { usePlanStore } from '../../store/plan'

export const ThreeView: React.FC = () => {
  const plan = usePlanStore((s) => s.doc)

  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />
      <Suspense fallback={null}>
        <Environment preset="city" />
        {/* walls */}
        {plan.walls.map((wall) => (
          <primitive object={polylineToWallMesh(wall)} key={wall.id} />
        ))}
        {/* floors */}
        {plan.rooms.map((room) => (
          <primitive object={roomsToFloors(room)} key={room.id} />
        ))}
      </Suspense>
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}
