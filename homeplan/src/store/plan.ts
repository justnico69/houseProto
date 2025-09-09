// src/store/plan.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/** === Types === **/
export type Point2 = { x: number; y: number }

export type Wall = {
  id: string
  points: Point2[]           // polyline
  thickness: number         // meters
  height: number            // meters
  materialId?: string
}

export type Opening = {
  id: string
  wallId: string
  distance: number          // meters from wall start along its polyline
  width: number
  height: number
  sillHeight: number
  type: 'door' | 'window'
}

export type Room = {
  id: string
  polygon: Point2[]        // closed polygon
  name?: string
  floorMaterialId?: string
}

export type Furniture = {
  id: string
  glbId: string
  position: { x: number; y: number; z: number }
  rotation: { yaw: number } // Y axis
  scale: number
}

/** Entire plan stored */
export type PlanDocument = {
  walls: Wall[]
  openings: Opening[]
  rooms: Room[]
  furniture: Furniture[]
  metadata?: { name?: string; createdAt?: string }
}

/** === Store === **/
type HistoryEntry = PlanDocument
type State = {
  doc: PlanDocument
  pushWall: (w: Wall) => void
  updateWall: (id: string, patch: Partial<Wall>) => void
  removeWall: (id: string) => void

  addOpening: (o: Opening) => void
  addRoom: (r: Room) => void

  addFurniture: (f: Furniture) => void
  updateFurniture: (id: string, patch: Partial<Furniture>) => void

  undo: () => void
  redo: () => void
}

const LS_KEY = 'homeplan:doc'
const initialDoc: PlanDocument = {
  walls: [],
  openings: [],
  rooms: [],
  furniture: [],
  metadata: { name: 'Untitled', createdAt: new Date().toISOString() },
}

const readLS = (): PlanDocument | null => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** naive undo/redo using stacks */
export const usePlanStore = create<State>()(
  devtools((set, get) => {
    // load
    const persisted = readLS() || initialDoc
    // internal history
    let undoStack: HistoryEntry[] = []
    let redoStack: HistoryEntry[] = []

    const persist = (doc: PlanDocument) => {
      try { localStorage.setItem(LS_KEY, JSON.stringify(doc)) } catch {}
    }

    const pushHistory = (doc: PlanDocument) => {
      undoStack.push(JSON.parse(JSON.stringify(doc)))
      // cap
      if (undoStack.length > 50) undoStack.shift()
      redoStack = [] // clear
    }

    return {
      doc: persisted,
      pushWall: (w) =>
        set((s) => {
          pushHistory(s.doc)
          const doc: PlanDocument = { ...s.doc, walls: [...s.doc.walls, w] }
          persist(doc)
          return { doc }
        }),
      updateWall: (id, patch) =>
        set((s) => {
          pushHistory(s.doc)
          const walls = s.doc.walls.map((w) => (w.id === id ? { ...w, ...patch } : w))
          const doc = { ...s.doc, walls }
          persist(doc)
          return { doc }
        }),
      removeWall: (id) =>
        set((s) => {
          pushHistory(s.doc)
          const doc = { ...s.doc, walls: s.doc.walls.filter((w) => w.id !== id) }
          persist(doc)
          return { doc }
        }),
      addOpening: (o) =>
        set((s) => {
          pushHistory(s.doc)
          const doc = { ...s.doc, openings: [...s.doc.openings, o] }
          persist(doc)
          return { doc }
        }),
      addRoom: (r) =>
        set((s) => {
          pushHistory(s.doc)
          const doc = { ...s.doc, rooms: [...s.doc.rooms, r] }
          persist(doc)
          return { doc }
        }),
      addFurniture: (f) =>
        set((s) => {
          pushHistory(s.doc)
          const doc = { ...s.doc, furniture: [...s.doc.furniture, f] }
          persist(doc)
          return { doc }
        }),
      updateFurniture: (id, patch) =>
        set((s) => {
          pushHistory(s.doc)
          const furniture = s.doc.furniture.map((it) => (it.id === id ? { ...it, ...patch } : it))
          const doc = { ...s.doc, furniture }
          persist(doc)
          return { doc }
        }),
      undo: () => {
        set((s) => {
          if (undoStack.length === 0) return s
          redoStack.push(JSON.parse(JSON.stringify(s.doc)))
          const prev = undoStack.pop()!
          persist(prev)
          return { doc: prev }
        })
      },
      redo: () => {
        set((s) => {
          if (redoStack.length === 0) return s
          undoStack.push(JSON.parse(JSON.stringify(s.doc)))
          const next = redoStack.pop()!
          persist(next)
          return { doc: next }
        })
      },
    }
  })
)
