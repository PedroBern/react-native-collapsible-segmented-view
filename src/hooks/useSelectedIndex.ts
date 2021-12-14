import React from 'react'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'

/**
 *
 * Returns the current segment selected index
 *
 * @returns number
 */
export function useSelectedIndex(): number {
  const { index, trackIndex } = useSegmentedViewContext()
  const { index: segmentIndex } = useSegmentContext()

  const trackSelectedIndex = React.useRef(trackIndex.current)
  const [selectedIndex, setSelectedIndex] = React.useState(
    trackSelectedIndex.current
  )

  React.useEffect(() => {
    const listener = index.addListener(({ value }) => {
      if (value !== trackSelectedIndex.current) {
        trackSelectedIndex.current = value
        setSelectedIndex(trackIndex.current)
      }
    })

    return () => {
      index.removeListener(listener)
    }
  }, [index, segmentIndex, trackIndex])

  return selectedIndex
}
