import React from 'react'
import { FlatList as RNFlatList, FlatListProps, Animated } from 'react-native'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'
import { useCollapsibleStyle } from '../useCollapsibleStyle'

/**
 * Use like a regular flatlist.
 */
export function FlatList<T = any>({
  contentContainerStyle,
  style,
  ...rest
}: FlatListProps<T>): React.ReactElement {
  const ref = React.useRef<RNFlatList>()
  const {
    style: _style,
    contentContainerStyle: _contentContainerStyle,
    progressViewOffset,
  } = useCollapsibleStyle()

  const { index } = useSegmentContext()

  const { scrollY, setRef, contentInset } = useSegmentedViewContext()

  React.useEffect(() => {
    // @ts-ignore
    setRef(ref, index)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Animated.FlatList
      {...rest}
      // @ts-ignore
      ref={ref}
      bouncesZoom={false}
      style={[_style, style]}
      contentContainerStyle={[_contentContainerStyle, contentContainerStyle]}
      progressViewOffset={progressViewOffset}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      contentInset={{ top: contentInset }}
      contentOffset={{
        y: -contentInset,
        x: 0,
      }}
      automaticallyAdjustContentInsets={false}
    />
  )
}
