import React from 'react'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'

/**
 *
 * Returns true if the segment is focused, else returns false
 *
 * @returns boolean
 */
export function useIsFocused(): boolean {
  const { index, trackIndex } = useSegmentedViewContext()
  const { index: segmentIndex } = useSegmentContext()

  const trackIsFocused = React.useRef(trackIndex.current === segmentIndex)
  const [isFocused, setIsFocused] = React.useState(trackIsFocused.current)

  React.useEffect(() => {
    const listener = index.addListener(({ value }) => {
      if (
        (value === segmentIndex && !trackIsFocused.current) ||
        (value !== segmentIndex && trackIsFocused.current)
      ) {
        trackIsFocused.current = !trackIsFocused.current
        setIsFocused(trackIsFocused.current)
      }
    })

    return () => {
      index.removeListener(listener)
    }
  }, [index, segmentIndex])

  return isFocused
}
