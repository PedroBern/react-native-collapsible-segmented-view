import React from 'react'
import { Animated } from 'react-native'

import { ScrollRef, SyncScene } from './types'

export type SegmentedViewContextType = {
  contentInset: number
  headerHeight: number
  controlHeight: number
  containerHeight: number
  scrollY: Animated.Value
  setRef: (ref: ScrollRef, index: number) => void
  lazy: boolean
  index: Animated.Value
  initialIndex: number
  syncScene: SyncScene
  prevIndex: React.MutableRefObject<number>
  trackIndex: React.MutableRefObject<number>
  translateY: Animated.AnimatedInterpolation
  onTabPress: (nextIndex: number) => void
  onMomentum: React.MutableRefObject<boolean>
}

export const SegmentedViewContext = React.createContext<
  SegmentedViewContextType | undefined
>(undefined)

export function useSegmentedViewContext(): SegmentedViewContextType {
  const c = React.useContext(SegmentedViewContext)
  if (!c)
    throw new Error(
      'useSegmentedViewContext must be inside a SegmentedViewContext'
    )
  return c
}
