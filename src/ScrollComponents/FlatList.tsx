import React from 'react'
import { FlatList as RNFlatList, FlatListProps, Animated } from 'react-native'

import { useSegmentContext } from '../SegmentContext'
import { useSegmentedViewContext } from '../SegmentedViewContext'
import { useCollapsibleStyle } from '../hooks/useCollapsibleStyle'

/**
 * Use like a regular flatlist.
 */
export function FlatList<T = any>({
  contentContainerStyle,
  style,
  refreshControl,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  onScrollBeginDrag,
  ...rest
}: FlatListProps<T>): React.ReactElement {
  const ref = React.useRef<RNFlatList>()
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
      refreshControl={
        refreshControl &&
        React.cloneElement(refreshControl, {
          progressViewOffset,
          ...refreshControl.props,
        })
      }
      onMomentumScrollBegin={_onMomentumScrollBegin}
      onMomentumScrollEnd={_onMomentumScrollEnd}
      onScrollBeginDrag={_onScrollBeginDrag}
    />
  )
}
