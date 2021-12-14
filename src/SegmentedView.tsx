import React from 'react'
import {
  Platform,
  View,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native'
import ViewPager, {
  PagerViewOnPageSelectedEvent,
  PageScrollStateChangedNativeEvent,
} from 'react-native-pager-view'

import { MaterialTabBar } from './ControlComponents/MaterialTabBar'
// import { SegmentedControl } from './ControlComponents/SegmentedControl'
import { SegmentReactElement } from './Segment'
import { SegmentContext } from './SegmentContext'
import { SegmentedViewContext } from './SegmentedViewContext'
import {
  IS_IOS,
  spring,
  CONTROL_HEIGHT,
  scrollTo,
  extractSegmentRouteProps,
} from './helpers'
import { ControlProps, ScrollRef } from './types'

export type Props = {
  animatedValue?: Animated.Value
  initialIndex?: number
  headerHeight?: number
  controlHeight?: number
  containerHeight?: number
  children: SegmentReactElement[]
  renderHeader?: () => React.ReactElement<any>
  renderControl?: (props: ControlProps) => React.ReactElement<any>
  lazy?: boolean
  containerStyle?: ViewStyle
  topStyle?: ViewStyle
  keyboardDismissMode?: 'none' | 'on-drag' | 'auto'
  swipeEnabled?: boolean
}

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager)

/**
 * Basic usage looks like this:
 *
 * ```tsx
 * import { Segmented } from 'react-native-collapsible-segmented-view'
 *
 * const Example = () => {
 *   return (
 *     <Segmented.View hader={MyHeader}>
 *       <Segmented.Segment id="A" component={ScreenA} />
 *       <Segmented.Segment id="B" component={ScreenB} />
 *        <Segmented.Segment id="C" component={ScreenC} />
 *     </Tabs.Container>
 *   )
 * }
 * ```
 */
export const SegmentedView: (props: Props) => JSX.Element = ({
  initialIndex = 0,
  animatedValue,
  headerHeight,
  controlHeight = CONTROL_HEIGHT,
  containerHeight = 0,
  children,
  renderHeader: HeaderComponent,
  renderControl: ControlComponent = MaterialTabBar, //IS_IOS ? SegmentedControl : MaterialTabBar,
  lazy = false,
  containerStyle,
  topStyle,
  keyboardDismissMode,
  swipeEnabled = true,
}) => {
  const routes = React.useMemo(
    () => extractSegmentRouteProps(children),
    [children]
  )
  const refs = React.useRef<undefined[] | ScrollRef[]>(
    routes.map(() => undefined)
  )

  // keep all heights on a single object insted of 3. This helps
  // reduce the rerenders from to 3 to 1 after the first mount
  const [layoutHeights, setLayoutHeights] = React.useState({
    header: headerHeight || 0,
    control: controlHeight,
    container: containerHeight,
    contentInset: IS_IOS ? (headerHeight || 0) + controlHeight : 0,
  })
  const trackHeaderHeight = React.useRef(layoutHeights.header)
  const trackControlHeight = React.useRef(layoutHeights.control)
  const trackContainerHeight = React.useRef(layoutHeights.container)

  // used to fade in the content, after getting all
  // layout heights, if headerHeight is undefined
  const onLayoutCalls = React.useRef(0)
  const [scenesOpacity] = React.useState(
    new Animated.Value(headerHeight === undefined ? 0 : 1)
  )

  const pagerRef = React.useRef<ViewPager>(null)
  const [index] = React.useState(new Animated.Value(initialIndex))
  const trackIndex = React.useRef(initialIndex)
  const prevIndex = React.useRef(initialIndex)
  const offsets = React.useRef(routes.map(() => -layoutHeights.contentInset))
  const [scrollY] = React.useState(
    animatedValue || new Animated.Value(-layoutHeights.contentInset)
  )
  const [pagerIndex] = React.useState(new Animated.Value(initialIndex))
  const [pagerOffset] = React.useState(new Animated.Value(0))
  const [position] = React.useState(Animated.add(pagerIndex, pagerOffset))
  const settlingTabPress = React.useRef(false)
  const nextIndexAfterTabPress = React.useRef<number | undefined>(undefined)

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

  const onMomentum = React.useRef(false)
  const [opacities] = React.useState(
    routes.map((_, i) => new Animated.Value(initialIndex === i ? 1 : 0))
  )
  const visibleScenes = React.useRef(routes.map((_, i) => initialIndex === i))

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

  const setRef = React.useCallback((ref: ScrollRef, index: number) => {
    refs.current[index] = ref
  }, [])

  const syncScene = React.useCallback(
    (nextIndex: number, _prevIndex?: number) => {
      const currentIndex =
        _prevIndex === undefined ? trackIndex.current : _prevIndex
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

        // scroll to the top if is refrehing the
        // current tab on iOS before changing tabs
        const isRefreshingOnIOS =
          IS_IOS && currOffset < -layoutHeights.contentInset
        if (isRefreshingOnIOS) {
          const ref = refs.current[currentIndex]?.current
          ref && scrollTo(ref, -layoutHeights.contentInset, true)
        }
        spring(opacities[nextIndex], 1).start()
        visibleScenes.current[nextIndex] = true
      }
    },
    [layoutHeights.contentInset, layoutHeights.header, opacities]
  )

  // we hide unfocused scenes to sync while it's hidden,
  // preventing showing a gap before syncing had finished
  const hideUnfocusedScenes = React.useCallback(
    (nextIndex: number) => {
      const oldIndex = trackIndex.current
      if (nextIndex !== oldIndex) {
        spring(opacities[oldIndex], 0).start()
        trackIndex.current = nextIndex
        prevIndex.current = oldIndex
        visibleScenes.current[oldIndex] = false
        // ScrollStateChanged event can make 2 screens visible,
        // so we make sure to hide it
        visibleScenes.current.forEach((visible, i) => {
          if (i !== nextIndex && visible) {
            opacities[i].setValue(0)
            visibleScenes.current[i] = false
          }
        })
      }
    },
    [opacities]
  )

  // sync the next scene as soon as it appears while swiping
  const onPageScrollStateChanged = React.useCallback(
    (state: PageScrollStateChangedNativeEvent) => {
      if (!settlingTabPress.current) {
        const { pageScrollState } = state.nativeEvent

        switch (pageScrollState) {
          case 'dragging': {
            const subscription = pagerOffset.addListener(({ value }) => {
              const next = trackIndex.current + (value > 0.5 ? -1 : 1)
              if (
                next !== trackIndex.current &&
                next >= 0 &&
                next < routes.length
              ) {
                syncScene(next)
                visibleScenes.current[next] = true
              }
              pagerOffset.removeListener(subscription)
            })
          }
        }
      }
    },
    [routes.length, pagerOffset, syncScene]
  )

  const onPageSelected = React.useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const nextIndex = event.nativeEvent.position
      syncScene(nextIndex)
      index.setValue(nextIndex)
    },
    [index, syncScene]
  )

  const onTabPress = React.useCallback(
    (nextIndex: number) => {
      // disable tab press on momentum scroll
      // to prevent breaking sync logic
      if (!onMomentum.current) {
        pagerRef.current?.setScrollEnabled(false)
        settlingTabPress.current = true
        nextIndexAfterTabPress.current = nextIndex
        syncScene(nextIndex)
        index.setValue(nextIndex)
        pagerRef.current?.setPageWithoutAnimation(nextIndex)
        pagerOffset.setValue(nextIndex)
        pagerRef.current?.setScrollEnabled(true)
      }
    },
    [index, pagerOffset, syncScene]
  )

  React.useEffect(() => {
    const listener = pagerOffset.addListener(({ value }) => {
      if (
        settlingTabPress.current === true &&
        value === 0 &&
        trackIndex.current === nextIndexAfterTabPress.current
      ) {
        settlingTabPress.current = false
        nextIndexAfterTabPress.current = undefined
      }
    })

    return () => {
      pagerOffset.removeListener(listener)
    }
  }, [pagerOffset])

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
        syncScene,
        onTabPress,
        prevIndex,
        trackIndex,
        translateY: translateY.current,
        onMomentum,
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
              position={position}
              onTabPress={onTabPress}
              initialIndex={initialIndex}
              routes={routes}
            />
          </View>
        </Animated.View>
        <AnimatedViewPager
          ref={pagerRef}
          initialPage={initialIndex}
          style={[styles.container, { opacity: scenesOpacity }]}
          keyboardDismissMode={
            keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
          }
          onPageScroll={Animated.event(
            [{ nativeEvent: { position: pagerIndex, offset: pagerOffset } }],
            { useNativeDriver: true }
          )}
          onPageSelected={onPageSelected}
          scrollEnabled={swipeEnabled}
          onPageScrollStateChanged={onPageScrollStateChanged}
        >
          {React.Children.map(children, (child, index) => (
            <SegmentContext.Provider
              value={{ opacity: opacities[index], index, hideUnfocusedScenes }}
            >
              {child}
            </SegmentContext.Provider>
          ))}
        </AnimatedViewPager>
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
})
