import { Animated } from 'react-native'

import { useSegmentedViewContext } from '../SegmentedViewContext'

type HeaderMeasurements = {
  /**
   * translateY interpolation of the header
   */
  translateY: Animated.AnimatedInterpolation
  /**
   * The height of the header
   */
  height: number
}

/**
 *
 * Returns `translateY` interpolation and the height of the header.
 *
 * @returns HeaderMeasurements
 */
export function useHeaderMeasurements(): HeaderMeasurements {
  const { translateY, headerHeight } = useSegmentedViewContext()
  return {
    translateY,
    height: headerHeight,
  }
}
