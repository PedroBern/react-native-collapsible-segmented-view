import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { useSegmentContext } from './SegmentContext'
import { useSegmentedViewContext } from './SegmentedViewContext'
import { spring } from './helpers'
import { Route } from './types'

type Props = Route & {
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
 *  <Segmented.Segment id="A" component={ScreenA} />
 *  <Segmented.Segment id="B" component={ScreenB} />
 *  <Segmented.Segment id="C" component={ScreenC} />
 * </Segmented.Container>
 * ```
 */
export const Segment = ({ component: Component }: Props) => {
  const { opacity, index: segmentIndex } = useSegmentContext()
  const { lazy, syncScene, initialIndex, index, prevIndex } =
    useSegmentedViewContext()

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
      syncScene(segmentIndex, prevIndex.current)
      spring(wrapperOpacity, 1).start()
    }
  }, [mount, prevIndex, segmentIndex, syncScene, wrapperOpacity])

  return (
    <Animated.View style={[styles.scene, { opacity }]}>
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
