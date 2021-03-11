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
import {
  IS_IOS,
  extractLabels,
  spring,
  CONTROL_HEIGHT,
  scrollTo,
} from './helpers'
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
  disableFadeIn?: boolean
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
  animatedValue,
  headerHeight,
  controlHeight = CONTROL_HEIGHT,
  containerHeight = 0,
  children,
  header: HeaderComponent,
  control: ControlComponent = IS_IOS ? SegmentedControl : MaterialTabBar,
  lazy = false,
  containerStyle,
  topStyle,
  disableFadeIn = false,
}) => {
  const [labels] = React.useState(extractLabels(children))
  const refs = React.useRef<undefined[] | ScrollRef[]>(
    labels.map(() => undefined)
  )

  /**
   * keep all heights on a single object insted of 3. This helps
   * reduce the rerenders from to 3 to 1 after the first mount
   */
  const [layoutHeights, setLayoutHeights] = React.useState({
    header: headerHeight || 0,
    control: controlHeight,
    container: containerHeight,
    contentInset: IS_IOS ? (headerHeight || 0) + controlHeight : 0,
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
  const offsets = React.useRef(labels.map(() => -layoutHeights.contentInset))
  const [scrollY] = React.useState(
    animatedValue || new Animated.Value(-layoutHeights.contentInset)
  )

  const translateY = React.useRef(
    scrollY.interpolate({
      inputRange: [
        0 - layoutHeights.contentInset,
        layoutHeights.header - layoutHeights.contentInset,
      ],
      outputRange: [0, -layoutHeights.header],
      extrapolate: 'clamp',
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
      const contentInset = IS_IOS
        ? trackHeaderHeight.current + trackControlHeight.current
        : 0

      // update translateY if the header height has changed
      if (trackHeaderHeight.current !== layoutHeights.header) {
        translateY.current = scrollY.interpolate({
          inputRange: [
            0 - contentInset,
            trackHeaderHeight.current - contentInset,
          ],
          outputRange: [0, -trackHeaderHeight.current],
          extrapolate: 'clamp',
        })
      }

      // update offsets and scrollY
      // to get correct value after first render
      if (
        onLayoutCalls.current === 3 &&
        contentInset !== layoutHeights.contentInset
      ) {
        offsets.current = offsets.current.map(() => -contentInset)
        scrollY.setValue(-contentInset)
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
          contentInset,
        })
      }

      // fade in content in case it's hidden
      spring(scenesOpacity, 1).start()
    }
  }, [
    layoutHeights.container,
    layoutHeights.contentInset,
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
          scrollTo(nextRef, nextPosition)
          offsets.current[nextIndex] = nextPosition
        }

        // scroll to the top if is refrehing the current tab on iOS
        // before changing tabs
        const isRefreshingOnIOS =
          IS_IOS && currOffset < -layoutHeights.contentInset
        if (isRefreshingOnIOS) {
          const ref = refs.current[currentIndex]?.current
          ref && scrollTo(ref, -layoutHeights.contentInset)
        }

        if (!_syncOnly) {
          // show the next scene, and hide the current one
          visibility[nextIndex].zIndex.setValue(2)
          visibility[currentIndex].opacity.setValue(0)
          visibility[currentIndex].zIndex.setValue(0)
          if (disableFadeIn) {
            visibility[nextIndex].opacity.setValue(1)
            visibility[nextIndex].zIndex.setValue(1)
          } else {
            spring(visibility[nextIndex].opacity, 1).start(() => {
              visibility[nextIndex].zIndex.setValue(1)
            })
          }

          // update the mutable objects
          trackIndex.current = nextIndex
          prevIndex.current = currentIndex

          // update the animated values
          index.setValue(nextIndex)
          spring(floatIndex, nextIndex).start()
        }
      }
    },
    [
      layoutHeights.header,
      layoutHeights.contentInset,
      visibility,
      disableFadeIn,
      index,
      floatIndex,
    ]
  )

  const setRef = React.useCallback((ref: ScrollRef, index: number) => {
    refs.current[index] = ref
  }, [])

  return (
    <SegmentedViewContext.Provider
      value={{
        contentInset: layoutHeights.contentInset,
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
