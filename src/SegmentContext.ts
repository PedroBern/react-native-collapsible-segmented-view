import React from 'react'
import { Animated } from 'react-native'

export type SegmentContextType = {
  opacity: Animated.Value
  index: number
  hideUnfocusedScenes: (currentIndex: number) => void
}

export const SegmentContext = React.createContext<
  SegmentContextType | undefined
>(undefined)

export function useSegmentContext(): SegmentContextType {
  const c = React.useContext(SegmentContext)
  if (!c) throw new Error('useSegmentContext must be inside a SegmentContext')
  return c
}
