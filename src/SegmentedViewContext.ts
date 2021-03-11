import React from 'react'
import { Animated } from 'react-native'

import { ScrollRef, SetIndex } from './types'

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
  setIndex: SetIndex
  prevIndex: React.MutableRefObject<number>
  trackIndex: React.MutableRefObject<number>
  translateY: Animated.AnimatedInterpolation
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
