import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { useSegmentContext } from './SegmentContext'
import { useSegmentedViewContext } from './SegmentedViewContext'
import { spring } from './helpers'

type Props = {
  label: string
  component:
    | (() => React.ReactElement)
    | React.FC<any>
    | React.JSXElementConstructor<any>
}

export type SegmentReactElement = React.ReactElement<Props>

/**
 * Wrap your screens with `Segmented.Segment`. Basic usage looks like this:
 *
 * ```tsx
 * <Segmented.View ...>
 *  <Segmented.Segment label="A" component={ScreenA} />
 *  <Segmented.Segment label="B" component={ScreenB} />
 *  <Segmented.Segment label="C" component={ScreenC} />
 * </Segmented.Container>
 * ```
 */
export const Segment = ({ component: Component }: Props) => {
  const { opacity, zIndex, index: segmentIndex } = useSegmentContext()
  const {
    lazy,
    setIndex,
    initialIndex,
    index,
    prevIndex,
  } = useSegmentedViewContext()

  const trackMount = React.useRef(lazy ? initialIndex === segmentIndex : true)
  const [wrapperOpacity] = React.useState(
    new Animated.Value(trackMount.current ? 1 : 0)
  )
  const [mount, setMount] = React.useState(trackMount.current)

  React.useEffect(() => {
    let listener = ''
    if (lazy) {
      listener = index.addListener(({ value }) => {
        if (!trackMount.current && value === segmentIndex) {
          setMount(true)
        }
      })
    }

    return () => {
      if (lazy) {
        index.removeListener(listener)
      }
    }
  }, [index, lazy, segmentIndex])

  React.useEffect(() => {
    if (mount && !trackMount.current) {
      trackMount.current = mount
      setIndex(segmentIndex, prevIndex.current, true)
      spring(wrapperOpacity, 1).start()
    }
  }, [mount, prevIndex, segmentIndex, setIndex, wrapperOpacity])

  return (
    <Animated.View style={[styles.scene, { opacity, zIndex }]}>
      <Animated.View style={[styles.wrapper, { opacity: wrapperOpacity }]}>
        {mount && <Component />}
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  scene: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    opacity: 0,
  },
  wrapper: {
    flex: 1,
  },
})
