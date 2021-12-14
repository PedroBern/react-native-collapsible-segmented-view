import React from 'react'
import {
  Animated,
  ScrollViewProps,
  ScrollView as RNScrollView,
} from 'react-native'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'
import { useCollapsibleStyle } from '../hooks/useCollapsibleStyle'

/**
 * Use like a regular ScrollView.
 */
export const ScrollView: React.FC<Omit<ScrollViewProps, 'onScroll'>> = ({
  contentContainerStyle,
  style,
  onContentSizeChange,
  children,
  refreshControl,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollBeginDrag,
  ...rest
}) => {
  const ref = React.useRef<RNScrollView>()
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    progressViewOffset,
  } = useCollapsibleStyle()

  const { index, hideUnfocusedScenes } = useSegmentContext()

  const { scrollY, setRef, contentInset, onMomentum } =
    useSegmentedViewContext()

  React.useEffect(() => {
    // @ts-ignore
    setRef(ref, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const _onMomentumScrollBegin = React.useCallback(
    (event) => {
      onMomentum.current = true
      onMomentumScrollBegin?.(event)
    },
    [onMomentum, onMomentumScrollBegin]
  )

  const _onMomentumScrollEnd = React.useCallback(
    (event) => {
      onMomentum.current = false
      onMomentumScrollEnd?.(event)
    },
    [onMomentum, onMomentumScrollEnd]
  )

  const _onScrollBeginDrag = React.useCallback(
    (event) => {
      hideUnfocusedScenes(index)
      onScrollBeginDrag?.(event)
    },
    [hideUnfocusedScenes, index, onScrollBeginDrag]
  )

  return (
    <Animated.ScrollView
      {...rest}
      // @ts-ignore
      ref={ref}
      bouncesZoom={false}
      style={[_style, style]}
      scrollEventThrottle={16}
      contentContainerStyle={[_contentContainerStyle, contentContainerStyle]}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      refreshControl={
        refreshControl &&
        React.cloneElement(refreshControl, {
          progressViewOffset,
          ...refreshControl.props,
        })
      }
      contentInset={{ top: contentInset }}
      contentOffset={{
        y: -contentInset,
        x: 0,
      }}
      automaticallyAdjustContentInsets={false}
      onMomentumScrollBegin={_onMomentumScrollBegin}
      onMomentumScrollEnd={_onMomentumScrollEnd}
      onScrollBeginDrag={_onScrollBeginDrag}
    >
      {children}
    </Animated.ScrollView>
  )
}
