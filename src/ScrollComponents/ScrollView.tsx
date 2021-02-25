import React from 'react'
import {
  Animated,
  ScrollViewProps,
  ScrollView as RNScrollView,
} from 'react-native'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'
import { useCollapsibleStyle } from '../useCollapsibleStyle'

/**
 * Use like a regular ScrollView.
 */
export const ScrollView: React.FC<Omit<ScrollViewProps, 'onScroll'>> = ({
  contentContainerStyle,
  style,
  onContentSizeChange,
  children,
  refreshControl,
  ...rest
}) => {
  const ref = React.useRef<RNScrollView>()
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    progressViewOffset,
  } = useCollapsibleStyle()

  const { index } = useSegmentContext()

  const { scrollY, setRef } = useSegmentedViewContext()

  React.useEffect(() => {
    // @ts-ignore
    setRef(ref, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Animated.ScrollView
      {...rest}
      // @ts-ignore
      ref={ref}
      bouncesZoom={false}
      style={[_style, style]}
      contentContainerStyle={[_contentContainerStyle, contentContainerStyle]}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      refreshControl={
        refreshControl &&
        React.cloneElement(refreshControl, {
          ...refreshControl.props,
          progressViewOffset,
        })
      }
    >
      {children}
    </Animated.ScrollView>
  )
}
