// src/store/plan.ts
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import type { Furniture, Opening, Room, Wall } from './types'

export type PlanStore = {
  walls: Wall[]
  rooms: Room[]
  openings: Opening[]
  furniture: Furniture[]
  addWall: (wall: Wall) => void
  addRoom: (room: Room) => void
  addFurniture: (f: Furniture) => void
}

export const usePlanStore = create<PlanStore>((set) => ({
  walls: [],
  rooms: [],
  openings: [],
  furniture: [],
  addWall: (wall: Wall) => set((state) => ({ walls: [...state.walls, { ...wall, id: uuidv4() }] })),
  addRoom: (room: Room) => set((state) => ({ rooms: [...state.rooms, { ...room, id: uuidv4() }] })),
  addFurniture: (furniture: Furniture) => set((state) => ({ furniture: [...state.furniture, { ...furniture, id: uuidv4() }] })),
}))
