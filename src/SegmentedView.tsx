import React from 'react'
import {
  Platform,
  View,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native'

import { MaterialTabBar } from './MaterialTabBar'
import { SegmentReactElement } from './Segment'
import { SegmentContext } from './SegmentContext'
import { SegmentedControl } from './SegmentedControl'
import { SegmentedViewContext } from './SegmentedViewContext'
import { IS_IOS, extractLabels, spring } from './helpers'
import { ScrollRef, ControlProps, SetIndex } from './types'

export type Props = {
  animatedValue?: Animated.Value
  initialIndex?: number
  headerHeight?: number
  controlHeight?: number
  containerHeight?: number
  children: SegmentReactElement[]
  header?: React.FC | (() => React.ReactElement<any>)
  control?:
    | React.FC<Partial<ControlProps>>
    | ((props: Partial<ControlProps>) => React.ReactElement<any>)
  lazy?: boolean
  containerStyle?: ViewStyle
  topStyle?: ViewStyle
}

/**
 * Basic usage looks like this:
 *
 * ```tsx
 * import { Segmented } from 'react-native-collapsible-segmented-view'
 *
 * const Example = () => {
 *   return (
 *     <Segmented.View hader={MyHeader}>
 *       <Segmented.Segment label="A" component={ScreenA} />
 *       <Segmented.Segment label="B" component={ScreenB} />
 *        <Segmented.Segment label="C" component={ScreenC} />
 *     </Tabs.Container>
 *   )
 * }
 * ```
 */
export const SegmentedView: React.FC<Props> = ({
  initialIndex = 0,
  animatedValue = new Animated.Value(0),
  headerHeight,
  controlHeight = 0,
  containerHeight = 0,
  children,
  header: HeaderComponent,
  control: ControlComponent = IS_IOS ? SegmentedControl : MaterialTabBar,
  lazy = false,
  containerStyle,
  topStyle,
}) => {
  const [labels] = React.useState(extractLabels(children))
  const refs = React.useRef<undefined[] | ScrollRef[]>(
    labels.map(() => undefined)
  )
  const [scrollY] = React.useState(animatedValue)

  /**
   * keep all heights on a single object insted of 3. This helps
   * reduce the rerenders from to 3 to 1 after the first mount
   */
  const [layoutHeights, setLayoutHeights] = React.useState({
    header: headerHeight || 0,
    control: controlHeight,
    container: containerHeight,
  })
  const trackHeaderHeight = React.useRef(layoutHeights.header)
  const trackControlHeight = React.useRef(layoutHeights.control)
  const trackContainerHeight = React.useRef(layoutHeights.container)

  /**
   * used to fade in the content, after getting all
   * layout heights, if headerHeight is undefined
   */
  const onLayoutCalls = React.useRef(0)
  const [scenesOpacity] = React.useState(
    new Animated.Value(headerHeight === undefined ? 0 : 1)
  )

  const [index] = React.useState(new Animated.Value(initialIndex))
  const [floatIndex] = React.useState(new Animated.Value(initialIndex))
  const trackIndex = React.useRef(initialIndex)
  const prevIndex = React.useRef(initialIndex)
  const offsets = React.useRef(labels.map(() => 0))

  const translateY = React.useRef(
    scrollY.interpolate({
      inputRange: [0, layoutHeights.header],
      outputRange: [0, -layoutHeights.header],
      extrapolateRight: 'clamp',
    })
  )

  const [visibility] = React.useState(
    labels.map((_, i) => ({
      opacity: new Animated.Value(initialIndex === i ? 1 : 0),
      zIndex: new Animated.Value(initialIndex === i ? 1 : 0),
    }))
  )

  const maybeTriggerRerenderAfterOnLayout = React.useCallback(() => {
    // layout calls = hedaer + control + container
    if (onLayoutCalls.current >= 3) {
      // update translateY if the header height has changed
      if (trackHeaderHeight.current !== layoutHeights.header) {
        translateY.current = scrollY.interpolate({
          inputRange: [0, trackHeaderHeight.current],
          outputRange: [0, -trackHeaderHeight.current],
          extrapolateRight: 'clamp',
        })
      }

      // update the layoutHeights
      if (
        trackContainerHeight.current !== layoutHeights.container ||
        trackHeaderHeight.current !== layoutHeights.header ||
        trackControlHeight.current !== layoutHeights.control
      ) {
        setLayoutHeights({
          header: trackHeaderHeight.current,
          control: trackControlHeight.current,
          container: trackContainerHeight.current,
        })
      }

      // fade in content in case it's hidden
      spring(scenesOpacity, 1).start()
    }
  }, [
    layoutHeights.container,
    layoutHeights.control,
    layoutHeights.header,
    scenesOpacity,
    scrollY,
  ])

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent, ref: React.MutableRefObject<number>) => {
      onLayoutCalls.current += 1
      const { height } = event.nativeEvent.layout
      ref.current = height
      maybeTriggerRerenderAfterOnLayout()
    },
    [maybeTriggerRerenderAfterOnLayout]
  )

  const onContainerLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event, trackContainerHeight)
    },
    [onLayout]
  )

  const onHeaderLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event, trackHeaderHeight)
    },
    [onLayout]
  )

  const onControlLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout(event, trackControlHeight)
    },
    [onLayout]
  )

  React.useEffect(() => {
    offsets.current.forEach((_, index) => {
      scrollY.addListener(({ value }) => {
        if (index === trackIndex.current) {
          offsets.current[index] = value
        }
      })
    })

    return () => {
      scrollY.removeAllListeners()
    }
  }, [scrollY])

  const setIndex = React.useCallback<SetIndex>(
    (nextIndex, _currentIndex, _syncOnly) => {
      const currentIndex =
        _currentIndex === undefined ? trackIndex.current : _currentIndex
      if (nextIndex !== currentIndex) {
        const currOffset = offsets.current[currentIndex]
        const nextOffset = offsets.current[nextIndex]

        let nextPosition: null | number = null

        // compute how much we need to scroll to sync the next scene
        if (currOffset > nextOffset && nextOffset < layoutHeights.header) {
          nextPosition = Math.min(currOffset, layoutHeights.header)
        } else if (
          currOffset < nextOffset &&
          currOffset < layoutHeights.header
        ) {
          nextPosition = currOffset
        }

        const nextRef = refs.current[nextIndex]?.current

        // scroll to the correct offset
        if (nextPosition !== null && nextRef) {
          if (nextRef.scrollToOffset) {
            nextRef.scrollToOffset({
              animated: false,
              offset: nextPosition,
            })
          } else {
            nextRef.scrollTo({
              x: 0,
              y: nextPosition,
              animated: false,
            })
          }
          offsets.current[nextIndex] = nextPosition
        }

        if (!_syncOnly) {
          // show the next scene, and hide the current one
          visibility[nextIndex].zIndex.setValue(2)
          visibility[currentIndex].opacity.setValue(0)
          visibility[currentIndex].zIndex.setValue(0)
          spring(visibility[nextIndex].opacity, 1).start(() => {
            visibility[nextIndex].zIndex.setValue(1)
          })

          // update the mutable objects
          trackIndex.current = nextIndex
          prevIndex.current = currentIndex

          // update the animated values
          index.setValue(nextIndex)
          spring(floatIndex, nextIndex).start()
        }
      }
    },
    [floatIndex, layoutHeights.header, index, visibility]
  )

  const setRef = React.useCallback((ref: ScrollRef, index: number) => {
    refs.current[index] = ref
  }, [])

  return (
    <SegmentedViewContext.Provider
      value={{
        headerHeight: layoutHeights.header,
        controlHeight: layoutHeights.control,
        containerHeight: layoutHeights.container,
        scrollY,
        setRef,
        lazy,
        index,
        initialIndex,
        setIndex,
        prevIndex,
        trackIndex,
        translateY: translateY.current,
      }}
    >
      <View
        style={[styles.container, containerStyle]}
        onLayout={onContainerLayout}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.top,
            { transform: [{ translateY: translateY.current }] },
            topStyle,
          ]}
          pointerEvents="box-none"
        >
          <View onLayout={onHeaderLayout} pointerEvents="box-none">
            {HeaderComponent && <HeaderComponent />}
          </View>
          <View onLayout={onControlLayout} style={styles.control}>
            <ControlComponent
              index={index}
              floatIndex={floatIndex}
              setIndex={setIndex}
              initialIndex={initialIndex}
              labels={labels}
            />
          </View>
        </Animated.View>
        <Animated.View style={[styles.scenes, { opacity: scenesOpacity }]}>
          {React.Children.map(children, (child, index) => (
            <SegmentContext.Provider value={{ ...visibility[index], index }}>
              {child}
            </SegmentContext.Provider>
          ))}
        </Animated.View>
      </View>
    </SegmentedViewContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 4,
      },
    }),
  },
  control: {
    zIndex: 100,
    width: '100%',
  },
  scenes: {
    flex: 1,
  },
})
