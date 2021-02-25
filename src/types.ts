import { MutableRefObject } from 'react'
import { Animated } from 'react-native'

export type ScrollableView = {
  scrollTo: (params: { x?: number; y?: number; animated?: boolean }) => void
  scrollToOffset?: never
}

type ScrollableList = {
  scrollTo?: never
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void
}

export type ScrollRef =
  | MutableRefObject<ScrollableView>
  | MutableRefObject<ScrollableList>

export type ControlProps = {
  initialIndex: number
  index: Animated.Value
  floatIndex: Animated.Value
  setIndex: (nextIndex: number) => void
  labels: string[]
}

export type SetIndex = (
  nextIndex: number,
  _currentIndex?: number,
  _syncOnly?: boolean
) => void
