// src/store/types.ts
export type Wall = { id: string; points: { x: number; y: number }[]; thickness: number; height: number; materialId?: string }
export type Room = { id: string; polygon: { x: number; y: number }[]; name: string; floorMaterialId?: string }
export type Opening = { id: string; wallId: string; offset: number; width: number; height: number; sillHeight?: number }
export type Furniture = { id: string; glbId: string; position: { x: number; y: number; z: number }; rotation: number; scale: number }
