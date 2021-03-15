import { MutableRefObject } from 'react'
import { Animated } from 'react-native'
import { Route as RNTVRoute } from 'react-native-tab-view'

export type Route = Omit<RNTVRoute, 'key'> & { id: string }

export type ScrollableView = {
  scrollTo: (params: { x?: number; y?: number; animated?: boolean }) => void
  scrollToOffset?: never
}

type ScrollableList = {
  scrollTo?: never
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void
}

export type ScrollElement = ScrollableView | ScrollableList

export type ScrollRef =
  | MutableRefObject<ScrollableView>
  | MutableRefObject<ScrollableList>

export type ControlProps = {
  initialIndex: number
  position: Animated.AnimatedAddition
  onTabPress: (nextIndex: number) => void
  routes: Route[]
  index: Animated.Value
}

export type SyncScene = (nextIndex: number, _currentIndex?: number) => void
