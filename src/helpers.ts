import { Children } from 'react'
import { Animated, Platform } from 'react-native'

import { ScrollElement } from './types'

export const IS_IOS = Platform.OS === 'ios'

export const spring = (
  value: Animated.Value,
  to: number,
  native: boolean = true
) => {
  return Animated.spring(value, {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
    toValue: to,
    useNativeDriver: native,
  })
}

export const extractLabels = (
  segments: { props: { label: string } }[]
): string[] => {
  const labels: string[] = []
  Children.forEach(segments, (element) => {
    const { label } = element.props
    labels.push(label)
  })
  return labels
}

export const CONTROL_HEIGHT = 48

export const scrollTo = (
  ref: ScrollElement,
  to: number,
  animated: boolean = false
) => {
  if (ref.scrollToOffset) {
    ref.scrollToOffset({
      offset: to,
      animated,
    })
  } else {
    ref?.scrollTo({
      x: 0,
      y: to,
      animated,
    })
  }
}
